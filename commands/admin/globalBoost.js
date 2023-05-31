module.exports = {
    name: "globalBoost",
    aliases: ["globalBoosts"],
    category: "admin",
    description: "globalBoost",
    usage: "`.globalBoost <boost>`",
    run: async (RosaCoins, message, args) => {
        const managers = RosaCoins.managers,
            { guildManager } = managers.getDataUser(message);

        if(!args[0]) return message.reply("Veuillez entrer le multiplicateur !");
        if (isNaN(args[0])) return message.reply("Veuillez un nombre correcte !");
        if(!args[1]) return message.reply("Veuillez entrer le nombre de minute !");
        if (isNaN(args[1])) return message.reply("Veuillez un nombre correcte !");

        let boost = parseFloat(args[0]);
        let time = parseInt(args[1]);

        await RosaCoins.database.models.guilds.update({
            globalBoost: boost
        }, {
            where: {
                guildId: message.guild.id
            }
        })

        message.channel.send("Le globalBoost est maintenant à x" + boost);

        setTimeout(() => {
            RosaCoins.database.models.guilds.update({
                globalBoost: 0
            }, {
                where: {
                    guildId: message.guild.id
                }
            })
            message.reply("Le globalBoost à été reset !")
        }, time*60000);
    }
}