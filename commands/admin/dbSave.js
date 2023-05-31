module.exports = {
    name: "dbSave",
    category: "admin",
    usage: "`.dbSave`",
    aliases: ["databaseSave", "saveDb", "saveDatabase"],
    description: "dbSave",
    run: async (RosaCoins, message, args) => {
        const managers = RosaCoins.managers,
            {guildManager} = managers.getDataUser(message);

        console.log("\n================================================")
        for await (const guildManager of managers.guildManager)
            try {
                await guildManager[1].pushData(RosaCoins);
            } catch (e) {}
        console.log(`Successfully pushed ${managers.guildManager.size} Guilds data to the database.`)
        for await (const teamManager of managers.teamManager)
            try {
                await teamManager[1].pushData(RosaCoins);
            } catch (e) {}
        console.log(`Successfully pushed ${managers.teamManager.size} Teams data to the database.`)
        for await (const userManager of managers.userManager)
            try {
                await userManager[1].pushData(RosaCoins);
            } catch (e) {}
        console.log(`Successfully pushed ${managers.userManager.size} Users data to the database.`)
        for await (const printerManager of managers.printerManager)
            try {
                await printerManager[1].pushData(RosaCoins);
            } catch (e) {}
        console.log(`Successfully pushed ${managers.printerManager.size} Printers data to the database.`)
        for await (const characterManager of managers.characterManager)
            try {
                await characterManager[1].pushData(RosaCoins);
            } catch (e) { }
        console.log(`Successfully pushed ${managers.characterManager.size} Characters data to the database.`)
        for await (const mineZoneManager of managers.mineZoneManager)
            try {
                await mineZoneManager[1].pushData(RosaCoins);
            } catch (e) {}
        console.log(`Successfully pushed ${managers.mineZoneManager.size} MineZones data to the database.`)
        console.log("================================================\n")
        message.reply("Saved.")
    }
}