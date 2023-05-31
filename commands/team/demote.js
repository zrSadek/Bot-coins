module.exports = {
    name: "removeTeamAdmin",
    category: "team",
    aliases: ["removeTeamAdmins", "demote", "removeAdmin"],
    description: "removeTeamAdmin",
    usage: "`.removeAdmin <@mention>`",
    run: async (RosaCoins, message, args) => {
        const managers = RosaCoins.managers,
            { userManager, guildManager } = managers.getDataUser(message);

        if (!userManager) return;

        if(!userManager.teamName) return message.channel.send("Vous n'avez pas de team !");

        const { teamManager } = managers.getDataTeam(message, {
            teamName: userManager.teamName
        });

        if (args.length < 1) return message.reply("Please specify a user.");

        if (args[0])
            args[0] = args[0].startsWith("<@") && args[0].endsWith(">") ? args[0].replace(/!/, '').slice(2, -1) : args[0];

        const targetManager = managers.getDataUser(message, {
            userId: args[0]
        })

        if(!targetManager.userManager) return message.channel.send(`<@${args[0]}> n'est pas dans la db !`);

        if(targetManager.userManager.teamName !== userManager.teamName) return message.channel.send("L'utilisateur mentionnez n'est pas dans votre team !");
        if(args[0] === message.author.id) return message.channel.send("Vous ne pouvez pas vous de-rank vous même !");

        if(message.author.id !== teamManager.ownerId) return message.channel.send("Seul l'owner de la team peut utiliser cette commande !");

        if (!teamManager.adminIds['admins'].includes(args[0])) return message.reply("User not admin.")

        // DELETE ADMIN
        teamManager.adminIds['admins'] = teamManager.adminIds['admins'].filter(adminId => adminId !== args[0]);

        message.channel.send(`<@${args[0]}> est maintenant de-rank !`);
    }
}