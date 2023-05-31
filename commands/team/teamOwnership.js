module.exports = {
    name: "teamOwnership",
    category: "team",
    aliases: ["teamOwnerships", "teamOwner", "teamChef", "chefTeam"],
    description: "addTeamAdmin",
    usage: "`.teamOwner <@mention>`",
    run: async (RosaCoins, message, args) => {
        const managers = RosaCoins.managers,
            { guildManager, userManager } = managers.getDataUser(message);

        if (!guildManager) return message.reply(`${message.guild.name} not found in manager !`);
        if (!userManager) return;

        if(!userManager.teamName) return message.channel.send("Vous n'avez pas de team !");

        if (args.length < 1) return message.reply("Please specify a user.");

        if (args[0])
            args[0] = args[0].startsWith("<@") && args[0].endsWith(">") ? args[0].replace(/!/, '').slice(2, -1) : args[0];

        const user = RosaCoins.users.cache.get(args[0]);

        if (!user) return message.channel.send("Veuillez mentionnez la personne à qui transférer la couronne de votre team !");

        const targetManager = managers.getDataUser(message, {
            userId: args[0]
        })

        if(!targetManager.userManager) return message.channel.send(`<@${args[0]}> n'est pas dans la db !`);

        const { teamManager } = managers.getDataTeam(message, {
            teamName: targetManager.userManager.teamName
        })

        if(!targetManager.userManager.teamName || targetManager.userManager.teamName !== teamManager.teamName) return message.channel.send("La personne que vous avez mentionnez doit rejoindre ta team !");

        if(args[0] === message.author.id) return message.channel.send("Vous ne pouvez pas transférer la couronne à vous même !");

        if(message.author.id !== teamManager.ownerId) return message.channel.send("Seul l'owner de la team peut utiliser cette commande !");

        if (teamManager.adminIds['admins'].includes(message.author.id) || teamManager.adminIds['admins'].includes(args[0]))
            teamManager.adminIds['admins'] = teamManager.adminIds['admins'].filter(adminId => adminId !== message.author.id || adminId !== args[0]);

        teamManager.ownerId = args[0];
        message.channel.send("Vous avez donner la couronne de votre team à <@" + args[0] + "> avec succès !");
    }
}