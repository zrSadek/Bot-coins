const config = require("../../config")

module.exports = {
    name: "infoTeam",
    category: "team",
    aliases: ["teamInfo", "team"],
    description: "infoTeam",
    usage: "`.infoTeam`",
    run: async (RosaCoins, message, args) => {
        const {guildManager, userManager} = RosaCoins.managers.getDataUser(message);
        //if (!guildManager || !userManager) return;

        if (!userManager.teamName) return message.reply(`pas de team.`);
        const teamManager = RosaCoins.managers.teamManager.get(`${message.guild.id}-${userManager.teamName}`);
        if (!teamManager) return message.reply(`Team error`);

        if (!message.member.roles.cache.has(teamManager.roleId))
            message.member.roles.add(teamManager.roleId);

        const membersTeam = RosaCoins.managers.userManager.filter(userManager => userManager.teamName === teamManager.teamName && userManager.guildId === message.guild.id && userManager.userId !== teamManager.ownerId);

        message.channel.send({
            embed: {
                description: `**Nom :** ${teamManager.teamName}\n
                **Créateur :** <@${teamManager.ownerId}> (\`${teamManager.ownerId}\`)\n
                **Administrateur(s) :** ${teamManager.adminIds['admins'].length < 1 ? 'Aucun' : teamManager.adminIds['admins'].map(value => `<@${value}>`).join(', ')}\n
                **Rôle :** ${teamManager.roleId !== null ? `<@&${teamManager.roleId}>` : 'Aucun'}\n
                **Salon :** ${teamManager.textId !== null ? `<#${teamManager.textId}>` : 'Aucun'}\n
                **Places :** ${teamManager.slot}\n
                **Argent :** ${teamManager.bank} €\n
                **Boost(s) :** x${teamManager.boost}\n
                **Membre(s) :** (${membersTeam.size} / ${teamManager.slot}) \n ${membersTeam.size < 1 ? 'Aucun' : membersTeam.map(memberTeam => `<@${memberTeam.userId}>`).join(', ')}`,
                color: config.color
            }
        })
    }
}