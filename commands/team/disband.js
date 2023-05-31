module.exports = {
    name: "disband",
    category: "team",
    aliases: ["deleteTeam", "teamDelete"],
    description: "disband",
    usage: "`.deleteTeam`",
    run: async (RosaCoins, message, args) => {
        const managers = RosaCoins.managers,
            { guildManager, userManager } = managers.getDataUser(message);
        if (!guildManager) return message.reply(`${message.guild.name} not found in manager !`);
        if (!userManager) return;
        if (!userManager.teamName) return message.reply(`pas de team.`);

        const { teamManager } = managers.getDataTeam(message, {
            teamName: userManager.teamName
        })
        
        if (message.author.id !== teamManager.ownerId) return message.reply(`Tu ne peut pas disband la team, car tu n'est pas le chef !`);
        const teamName = userManager.teamName;
        managers.userManager.filter(userManager => userManager.guildId === message.guild.id && userManager.teamName === teamManager.teamName).forEach(teamMember => {
            teamMember.teamName = null;
        })

        if (teamManager.voiceId) {
            const voice = message.guild.channels.resolve(teamManager.voiceId);
            if (voice)
                voice.delete()
        }
        if (teamManager.textId) {
            const text = message.guild.channels.resolve(teamManager.textId);
            if (text)
                text.delete()
        }
        if (teamManager.roleId) {
            const role = message.guild.roles.resolve(teamManager.roleId);
            if (role)
                role.delete()
        }

        teamManager.destroy(RosaCoins);
        message.reply(`Vous venez de disband la team: **${teamName}**`)
    }
}