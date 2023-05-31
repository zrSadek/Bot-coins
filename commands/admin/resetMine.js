module.exports = {
    name: "resetMine",
    category: "admin",
    description: "resetMine",
    usage: "`.resetMine <@mention>`",
    run: async (RosaCoins, message, args) => {
        const managers = RosaCoins.managers,
            { guildManager } = managers.getDataUser(message);

        if (args[0])
            args[0] = args[0].startsWith("<@") && args[0].endsWith(">") ? args[0].replace(/!/, '').slice(2, -1) : args[0];

        const user = RosaCoins.users.cache.get(args[0]);
        if (!user) return;

        const {mineZoneManager} = managers.getDataUser(message, args[0] ? {userId: args[0]} : {});

        mineZoneManager.inventory = {"inventory": []};
    }
}