module.exports = {
    name: "adminDisband",
    category: "admin",
    aliases: ["disbandAdmin", "removeTeam"],
    usage: "`.deleteTeam <TeamName>`",
    description: "adminDisband",
    run: async (RosaCoins, message, args) => {
        const managers = RosaCoins.managers,
            { guildManager } = managers.getDataUser(message);

        if (!args[0]) return message.reply('Tu doit mettre le nom de la team.');
        args = args.join(' ');

        const {teamManager} = managers.getDataTeam(message, {
            teamName: args
        })

        if (!teamManager) return message.reply(`Team inconnu`);

        managers.userManager.filter(userManager => userManager.guildId === message.guild.id && userManager.teamName === args).forEach(teamMember => {
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
        message.reply(`Vous venez de disband la team: **${args}**`)
    }
}