const tempChannel = new Map();

module.exports = (RosaCoins, oldState, newState) => {
    if (newState.member.user.bot) return;
    if (!RosaCoins.open || RosaCoins.lock) return;

    const keyMember = `${newState.guild.id}-${newState.member.id}`,
        managers = RosaCoins.managers;

    if (newState.channel) {
        managers.addMemberInVoice(keyMember, {
            guildId: newState.guild.id,
            userId: newState.member.id,
            keyMember,
            managers,
            newState
        })
    } else if (!newState.channel && managers.membersInVoice.has(keyMember))
        managers.membersInVoice.delete(keyMember);

    const {guildManager, teamManager} = managers.getDataUserWithGuildAndUser(newState.guild, newState.member.user, {});

    if (guildManager && teamManager && newState.channel && newState.channel.id === guildManager.channelVoiceTeam) {
        const keyTemVoice = `${newState.guild.id}-${teamManager.teamName}`;
        if (tempChannel.has(keyTemVoice)) {
            const voiceChannel = newState.guild.channels.resolve(tempChannel.get(keyTemVoice));
            if (voiceChannel) {
                newState.member.voice.setChannel(voiceChannel).catch(() => {});
                return;
            }
            tempChannel.delete(keyTemVoice);
        }

        if (!teamManager.roleId) return;

        newState.guild.channels.create(`${teamManager.teamName}`, {
            type: "voice",
            userLimit: 99,
            parent: newState.channel.parentID,
            permissionOverwrites: [
                {
                    id: newState.guild.id,
                    deny: ["CONNECT"],
                    allow: "VIEW_CHANNEL"
                },
                {
                    id: teamManager.roleId,
                    allow: "CONNECT"
                },
                {
                    id: teamManager.ownerId,
                    allow: ["MOVE_MEMBERS", "MANAGE_CHANNELS"]
                },
                ...teamManager.adminIds["admins"].map(admin => {
                    return {
                        id: admin,
                        allow: ["MOVE_MEMBERS", "MANAGE_CHANNELS"]
                    }
                })
            ]
        }).then(voice => {
            tempChannel.set(keyTemVoice, voice.id);
            newState.member.voice.setChannel(voice).catch(() => {});
        }).catch((err) => {})
    }

    const channelVoiceTeam = newState.guild.channels.resolve(guildManager.channelVoiceTeam);

    if (channelVoiceTeam && guildManager && oldState.channel && oldState.channel.parent && channelVoiceTeam.parent && oldState.channel.parent.id === channelVoiceTeam.parent.id && oldState.channel.id !== channelVoiceTeam.id && teamManager) {
        const keyTemVoice = `${oldState.guild.id}-${teamManager.teamName}`;
        if (oldState.channel.members.size < 1) {
            tempChannel.delete(keyTemVoice);
            oldState.channel.delete().catch(() => {});
        }
    }
}