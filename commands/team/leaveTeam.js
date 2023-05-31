module.exports = {
    name: "leaveTeam",
    category: "team",
    aliases: ["teamLeave"],
    description: "leaveTeam",
    usage: "`.leaveTeam`",
    run: async (RosaCoins, message, args) => {
        const managers = RosaCoins.managers,
            { userManager, guildManager } = managers.getDataUser(message);
        if (!userManager.teamName) return message.reply(`pas de team.`);

        const { teamManager } = managers.getDataTeam(message, {
            teamName: userManager.teamName
        })

        if (!teamManager) return message.reply(`TeamManager not found in manager !, contact admin`);

        if (message.author.id === teamManager.ownerId) return message.reply(`Tu ne peut pas quitté, car tu es le chef !`)

        if (teamManager.adminIds['admins'].includes(message.author.id))
            teamManager.adminIds['admins'] = teamManager.adminIds['admins'].filter(adminId => adminId !== message.author.id);

        message.reply(`Vous venez de quitté la team: **${userManager.teamName}**`)
        userManager.teamName = null;

        const member = message.guild.members.cache.get(message.author.id);
        if (!member) message.reply("Error not in server");
        member.roles.remove(message.guild.roles.cache.get(teamManager.roleId));
    }
}