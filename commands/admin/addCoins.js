module.exports = {
    name: "addMoney",
    category: "admin",
    aliases: ["addArgent", "argentAdd", "addMoney", "moneyAdd"],
    usage: "`.addArgent <@mention> <coins>`",
    description: "addMoney",
    run: async (RosaCoins, message, args) => {
        const managers = RosaCoins.managers,
            { guildManager } = managers.getDataUser(message);

        if (args[0])
            args[0] = args[0].startsWith("<@") && args[0].endsWith(">") ? args[0].replace(/!/, '').slice(2, -1) : args[0];

        const user = RosaCoins.users.cache.get(args[0]);
        if (!user) return;

        const targetData = managers.getDataUser(message, args[0] ? {userId: args[0]} : {});

        const targetManager = targetData.userManager ? targetData.userManager : managers.addUser(`${message.guild.id}-${args[0]}`, {
            guildId: message.guild.id,
            userId: args[0]
        });

        if (!args[1]) return message.reply(`Please enter coins amount.`);

        if (!isNaN(args[1])) {
            if (parseFloat(args[1]) > 0) {
                targetManager.coins += parseFloat(args[1]);
                message.channel.send(`Tu viens de donner **${args[1]}** Coins à ${user}.`);
            }else
                message.reply('Montant invalid')
        }
    }
}