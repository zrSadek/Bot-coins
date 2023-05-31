module.exports = {
    name: "pay",
    aliases: ["virement"],
    category: "coins",
    description: "pay",
    usage: "`.pay <@mention/userId (optional)> <coins>`",
    run: async (RosaCoins, message, args) => {
        if (args[0])
            args[0] = args[0].startsWith("<@") && args[0].endsWith(">") ? args[0].replace(/!/, '').slice(2, -1) : args[0];

        const targetUser_ = RosaCoins.users.cache.get(args[0]);

        const managers = RosaCoins.managers;
        const targetData = managers.getDataUser(message, args[0] ? {userId: args[0]} : {});
        const { userManager } = managers.getDataUser(message);
        if (!userManager) return message.reply("the user does not exist in database.");

        const targetManager = targetData.userManager ? targetData.userManager : managers.addUser(`${message.guild.id}-${args[0]}`, {
            guildId: message.guild.id,
            userId: args[0]
        });

        if (!args[1]) return message.reply(`Please enter coins amount.`);

        if (!isNaN(args[1])) {
            if (parseFloat(args[1]) > 0 && userManager.coins >= parseFloat(args[1])) {
                targetManager.coins += parseFloat(args[1]);
                userManager.coins -= parseFloat(args[1]);

                message.channel.send(`${message.author}, la transaction de _**${(parseFloat(args[1])).toFixed(2)} <a:rosaRose:792822115857465394> Coins**_ à été effectué.`);
            }else
                message.reply(`Your amount is not valid, (Your have ${userManager.coins.toLocaleString('fr-EU', {
                    style: 'currency',
                    currency: 'EUR',
                })} Coins)`)
        }
    }
}