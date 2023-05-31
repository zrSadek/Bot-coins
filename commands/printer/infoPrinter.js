const config = require("../../config")

module.exports = {
    name: "infoPrinter",
    category: "printer",
    aliases: ["printerInfo", "printer"],
    cooldown: 1000*10,
    description: "infoPrinter",
    usage: "`.infoPrinter`",
    run: async (RosaCoins, message, args) => {
        const managers = RosaCoins.managers,
            { guildManager, userManager, printerManager } = managers.getDataUser(message);
        
        //if (!printerManager) return message.reply(`pas de printer.`);
        
        message.channel.send({
            embed: getEmbed(message, printerManager)
        }).then(message_ => {
            const collector = message_.createReactionCollector((reaction, user) => ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"].includes(reaction.emoji.name) && user.id === message.author.id, {time: 60*1000})
            message_.react("1️⃣"); message_.react("2️⃣"); message_.react("3️⃣"); message_.react("4️⃣");message_.react("5️⃣");

            collector.on('collect', (reaction, user) => {
                reaction.users.remove(user.id);
                if (reaction.emoji.name === "1️⃣") {
                    if (printerManager.printerStatus) return message.reply("Tu doit eteindre le printer avant de rajouter des élements !").then(mes => mes.delete({timeout: 2500}));
                    if (printerManager.printerInk >= printerManager.printerLimitInk) return message.reply("Encres remplit a fond !").then(mes => mes.delete({timeout: 2500}));
                    if (userManager.coins < (printerManager.printerLimitInk-printerManager.printerInk)*8) return message.reply("vous n'avez pas assez d'argent.").then(mes => mes.delete({timeout: 2500}));
                    userManager.coins -= (printerManager.printerLimitInk-printerManager.printerInk)*8;
                    printerManager.printerInk = printerManager.printerLimitInk;
                    message_.edit({
                        embed: getEmbed(message, printerManager)
                    })
                    message.reply("tu viens de remplir l'encres a fond !").then(mes => mes.delete({timeout: 2500}));
                }
                if (reaction.emoji.name === "2️⃣") {
                    if (printerManager.printerStatus) return message.reply("Tu doit eteindre le printer avant de rajouter des élements !").then(mes => mes.delete({timeout: 2500}));
                    if (printerManager.printerPaper >= printerManager.printerLimitPaper) return message.reply("Papiers remplit a fond !").then(mes => mes.delete({timeout: 2500}));
                    if (userManager.coins < (printerManager.printerLimitPaper-printerManager.printerPaper)*8) return message.reply("vous n'avez pas assez d'argent.").then(mes => mes.delete({timeout: 2500}));
                    userManager.coins -= (printerManager.printerLimitPaper-printerManager.printerPaper)*8;
                    printerManager.printerPaper = printerManager.printerLimitPaper;
                    message_.edit({
                        embed: getEmbed(message, userManager)
                    })
                    message.reply("tu viens de remplir du papier !").then(mes => mes.delete({timeout: 2500}));
                }
                if (reaction.emoji.name === "3️⃣") {
                    if (printerManager.printerStatus) return message.reply("Tu doit eteindre le printer avant de rajouter des élements !").then(mes => mes.delete({timeout: 2500}));
                    if (printerManager.printerBattery >= printerManager.printerLimitBattery) return message.reply("Batteries charger a fond !").then(mes => mes.delete({timeout: 2500}));
                    if (userManager.coins < (printerManager.printerLimitBattery-printerManager.printerBattery)*10) return message.reply("vous n'avez pas assez d'argent.").then(mes => mes.delete({timeout: 2500}));
                    userManager.coins -= (printerManager.printerLimitBattery-printerManager.printerBattery)*10;
                    printerManager.printerBattery = printerManager.printerLimitBattery;

                    message_.edit({
                        embed: getEmbed(message, printerManager)
                    })
                    message.reply("tu viens de charger la batterie !").then(mes => mes.delete({timeout: 2500}));
                }


                if (reaction.emoji.name === "4️⃣") {
                    if ((printerManager.printerInk < 1 || printerManager.printerPaper < 1 || printerManager.printerBattery < 1) && !printerManager.printerStatus)
                        return message.reply("Tu doit d'abord acheté les élements.").then(mes => mes.delete({timeout: 2500}));
                    printerManager.printerStatus =! printerManager.printerStatus;
                    message_.edit({
                        embed: getEmbed(message, printerManager)
                    })
                    message.reply(`Tu viens ${printerManager.printerStatus ? "d'allumé" : "D'éteindre"} le printer.`).then(mes => mes.delete({timeout: 2500}));
                }

                if (reaction.emoji.name === "5️⃣") {
                    message.reply(`Tu viens de récupérer **${printerManager.printerBank.toLocaleString('fr-EU', {
                        style: 'currency',
                        currency: 'EUR',
                    })}**`).then(mes => mes.delete({timeout: 2500}));
                    userManager.dirtyCoins += parseFloat(printerManager.printerBank);
                    printerManager.printerBank = 0;
                    message_.edit({
                        embed: getEmbed(message, printerManager)
                    })
                }
            })
        })
    }
}

getEmbed = function (message, printerManager) {
    return {
        title: `${message.author.username} Printer`,
        color: config.color,
        description: `**Status:** ${!printerManager.printerStatus ? '<:red:1100521327691059260> (Éteint)' : '<:green:1100521286599450794> (Allumé)'}\n
                **Encre :** ${printerManager.printerInk}/${printerManager.printerLimitInk} Cartouche${printerManager.printerInk < 1 ? '' : 's'} ${printerManager.printerInk >= 20 ? '(Plein)' : ''}\n
                **Papier :** ${printerManager.printerPaper}/${printerManager.printerLimitPaper} Feuille${printerManager.printerPaper < 1 ? '' : 's'} ${printerManager.printerPaper >= 20 ? '(Plein)' : ''}\n
                **Batterie :** ${printerManager.printerBattery}% ${printerManager.printerBattery >= 100 ? '(Chargée)' : ''}\n
                **Argent :** ${printerManager.printerBank.toLocaleString('fr-EU', {style: 'currency', currency: 'EUR'})}\n\n
                \`\`\`Achats\`\`\`
                \`1️⃣\` => Remplir Encres (${printerManager.printerInk >= printerManager.printerLimitInk ? 'Plein' : `${(printerManager.printerLimitInk-printerManager.printerInk) * 8} €`})\n
                \`2️⃣\` => Remplir Papiers (${printerManager.printerPaper >= printerManager.printerLimitPaper ? 'Plein' : `${(printerManager.printerLimitPaper-printerManager.printerPaper) * 8} €`})\n
                \`3️⃣\` => Charger Batteries (${printerManager.printerBattery >= printerManager.printerLimitBattery ? 'Plein' : `${(printerManager.printerLimitBattery-printerManager.printerBattery) * 10} €`})\n\n
                \`4️⃣\` => ${!printerManager.printerStatus ? 'Allumer le printer' : 'Éteindre le printer\n'}\n
                \`5️⃣\` => Récupérer l'argent (${printerManager.printerBank.toLocaleString('fr-EU', {
            style: 'currency',
            currency: 'EUR',
        })})`,
        thumbnail: {
            url: 'https://cdn.discordapp.com/attachments/807610082586132520/811785984026869760/image-removebg-preview.png'
        }
    }
}