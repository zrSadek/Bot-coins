module.exports = {
    name: "lock",
    category: "admin",
    usage: "`.lock`",
    description: "lock",
    run: async (RosaCoins, message, args) => {
        const managers = RosaCoins.managers,
            {guildManager} = managers.getDataUser(message);

        RosaCoins.lock = !RosaCoins.lock;
        message.channel.send(`Locked: ${RosaCoins.lock}`)
    }
}