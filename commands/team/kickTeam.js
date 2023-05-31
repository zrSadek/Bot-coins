module.exports = {
    name: "kickTeam",
    category: "team",
    aliases: ["teamKick"],
    description: "kickTeam",
    usage: "`.kickTeam <@mention>`",
    run: async (RosaCoins, message, args) => {
        const managers = RosaCoins.managers,
            { guildManager, userManager } = managers.getDataUser(message);
        if (!guildManager) return message.reply(`${message.guild.name} not found in manager !`);
        if (!userManager) return;
        if (!userManager.teamName) return message.reply(`pas de team.`);

        const { teamManager } = managers.getDataTeam(message, {
            teamName: userManager.teamName
        })

        if (!teamManager) return message.reply(`Team Manager not found`);

        if (args[0])
            args[0] = args[0].startsWith("<@") && args[0].endsWith(">") ? args[0].replace(/!/, '').slice(2, -1) : args[0];

        const user = RosaCoins.users.cache.get(args[0]);

        if (!user) return message.reply(`User not found.`);
        if ( !(teamManager.ownerId === message.author.id || teamManager.adminIds['admins'].includes(message.author.id)) ) return message.reply(`Tu n'es pas admin ou owner de la team !`);

        if (message.author.id === user.id) return message.reply(`Tu peut pas te kick !`);

        if ( (teamManager.ownerId === user.id || teamManager.adminIds['admins'].includes(user.id)) && teamManager.ownerId !== message.author.id ) return message.reply('Tu ne peut pas kick le owner ou les admins !');

        const targetManager = managers.getDataUser(message, {
            userId: user.id
        })
        if (!targetManager.userManager) return message.channel.send(`<@${user.id}>, pas dans la db.`);

        if (targetManager.userManager.teamName === null || (targetManager.userManager.teamName && targetManager.userManager.teamName !== teamManager.teamName) ) return message.channel.send(`<@${user.id}> n'est pas dans la team !`);

        if (teamManager.adminIds['admins'].includes(user.id))
            teamManager.adminIds['admins'] = teamManager.adminIds['admins'].filter(adminId => adminId !== user.id);

        message.reply(`Vous venez de kick <@${user.id}> de la team **${targetManager.userManager.teamName}**`)
        targetManager.userManager.teamName = null;

        const member = message.guild.members.cache.get(user.id);
        if (!member) return message.channel.send("<@" + user.id + ">, Error not in server");
        member.roles.remove(message.guild.roles.cache.get(teamManager.roleId));
    }
}