module.exports = {
    name: "inviteTeam",
    category: "team",
    aliases: ["teamInvite"],
    description: "inviteTeam",
    usage: "`.inviteTeam <@mention>`",
    run: async (RosaCoins, message, args) => {
        const managers = RosaCoins.managers,
            { guildManager, userManager } = managers.getDataUser(message);
        if (!userManager.teamName) return message.reply(`pas de team.`);

        if (args.length < 1) return message.reply(`Please mention user.`)

        const {teamManager} = managers.getDataTeam(message, {
            teamName: userManager.teamName
        })

        if ( !(teamManager.ownerId === message.author.id || teamManager.adminIds['admins'].includes(message.author.id)) ) return message.reply(`Tu n'es pas admin ou owner de la team !`);

        if (args[0])
            args[0] = args[0].startsWith("<@") && args[0].endsWith(">") ? args[0].replace(/!/, '').slice(2, -1) : args[0];

        const user = RosaCoins.users.cache.get(args[0]);
        if (!user) return message.reply(`${args[0]} not valid.`);
        if (message.author.id === user.id) return message.reply(`Tu peut pas t'ajouter !`);

        const targetManager = managers.getDataUser(message, {
            userId: user.id
        })

        if (!targetManager) return message.channel.send(`${user}, pas dans la db.`);
        if (targetManager.userManager.teamName) return message.channel.send(`${user}, deja dans une team.`);

        const membersTeam = managers.userManager.filter(userManager => userManager.teamName === teamManager.teamName && userManager.guildId === message.guild.id && userManager.userId !== teamManager.teamName);
        if (membersTeam.size >= teamManager.slot) return message.reply(`Ta team est full !`);

        message.reply(`En attente de la réponse de ${user}, (Il doit activé les messages privé.)`);
        user.send(`${user} voulez vous rejoindre la **${teamManager.teamName}** ?`).then(message_ => {
            const collector = message_.createReactionCollector((reaction, user_) => ["🆗", "⛔"].includes(reaction.emoji.name) && user_.id === user.id, {max: 1, time: 30000})
            message_.react("🆗"); message_.react("⛔")
            collector.on('collect', (reaction, user_) => {
                if (reaction.emoji.name === "🆗") {
                    const member = message.guild.members.cache.get(user.id);
                    if (!member) message_.reply("Error not in server");
                    targetManager.userManager.teamName = teamManager.teamName;
                    member.roles.add(message.guild.roles.cache.get(teamManager.roleId));
                    message_.reply(`Vous avez rejoint la team.`)
                    message.reply(`${user} viens de rejoindre la team !`)
                }else {
                    message.reply(`${user} a refusé l'invitation !`)
                }
            })
        }).catch(() => {})
    }
}