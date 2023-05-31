module.exports = {
    name: "money",
    category: "coins",
    aliases: ["argent", "coins"],
    description: "money",
    usage: "`.argent <@mention/userId (optional)>`",
    run: (RosaCoins, message, args) => {
        if (args[0])
            args[0] = args[0].startsWith("<@") && args[0].endsWith(">") ? args[0].replace(/!/, '').slice(2, -1) : args[0];
        const managers = RosaCoins.managers;
        const { userManager, guildManager } = managers.getDataUser(message, args[0] ? {userId: args[0]} : {});
        const user = args[0] ? RosaCoins.users.cache.get(args[0]) : message.author;
        if (!user) return;

        message.channel.send(`${args[0] ? `<@${args[0]}>` : `<@${message.author.id}>`}, vous avez **${userManager.coins.toLocaleString('fr-EU', {
            style: 'currency',
            currency: 'EUR',
        })}**.`)
    }
}