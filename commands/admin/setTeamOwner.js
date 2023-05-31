module.exports = {
    name: "setTeamOwnership",
    category: "admin",
    aliases: ["setTeamOwnerships", "setTeamOwner", "setTeamChef", "seChefTeam"],
    usage: "`.setTeamOwnership <@mention> <teamName>`",
    description: "addTeamAdmin",
    run: async (RosaCoins, message, args) => {

        if (args[0])
            args[0] = args[0].startsWith("<@") && args[0].endsWith(">") ? args[0].replace(/!/, '').slice(2, -1) : args[0];

        const user = RosaCoins.users.cache.get(args[0]);
        if (!user) return message.channel.send("Veuillez mentionnez la personne à qui transférer la couronne de la team !");

        const managers = RosaCoins.managers,
            { guildManager, userManager } = managers.getDataUser(message, {userId: user.id});

        if (!guildManager) return message.reply(`${message.guild.name} not found in manager !`);
        if (!guildManager.wl || !guildManager.wl['wl'].includes(message.author.id)) return;
        args = args.slice(1).join(' ');

        const {teamManager} = managers.getDataTeam(message, {
            teamName: args
        })
        if (!teamManager) return message.reply(`Team inconnu`);

        if(!userManager.teamName) return message.channel.send("La personne que vous avez mentionnez doit rejoindre la team !");

        if (teamManager.adminIds['admins'].includes(teamManager.ownerId))
            teamManager.adminIds['admins'] = teamManager.adminIds['admins'].filter(adminId => adminId !== teamManager.ownerId);

        teamManager.ownerId = user.id;
        userManager.teamName = teamManager.teamName;
        message.channel.send("Vous avez donner la couronne de la team à <@" + user.id + "> avec succès !");
    }
}