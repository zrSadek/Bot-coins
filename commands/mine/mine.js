const moment = require('moment');
const config = require("../../config")

module.exports = {
    name: "mine",
    category: "mine",
    aliases: ["minage"],
    cooldown: 1000*10,
    usage: "`.mine`",
    description: "mine",
    run: async (RosaCoins, message, args) => {
        const managers = RosaCoins.managers,
            {guildManager, userManager, mineZoneManager} = managers.getDataUser(message);

        message.channel.send({
            embed: getMineInv(message, managers, mineZoneManager)
        }).then(message_ => {
            const collector = message_.createReactionCollector((reaction, user) => ["1️⃣", "2️⃣"].includes(reaction.emoji.name) && user.id === message.author.id, {time: 60*1000})
            message_.react("1️⃣"); message_.react("2️⃣");

            collector.on('collect', (reaction, user) => {
                const slot = mineZoneManager.inventory["inventory"].length < 1 ? 0 : mineZoneManager.inventory["inventory"].map(v => v.count).reduce((previousValue, currentValue) => previousValue + currentValue);
                reaction.users.remove(user.id);
                if (reaction.emoji.name === "1️⃣") {
                    if (userManager.coins < managers.ores[managers.ores.length-2].price) return message.reply("vous n'avez pas assez d'argent.").then(mes => mes.delete({timeout: 2500}));

                    if (mineZoneManager.inventory["inventory"].find(x => x.name === managers.ores[managers.ores.length-2].name) && mineZoneManager.inventory["inventory"].find(x => x.name === managers.ores[managers.ores.length-2].name).count > 15) return message.reply("Vous ne pouvez pas acheté plus de 15 charbon").then(mes => mes.delete({timeout: 2500}));

                    if (slot >= mineZoneManager.slotInventory+2) return message.reply("Votre inventaire est remplit a fond !").then(mes => mes.delete({timeout: 2500}));
                    userManager.coins -= parseFloat(managers.ores[managers.ores.length-2].price);
                    RosaCoins.functions.addItemInMine(managers, mineZoneManager, managers.ores[managers.ores.length-2]);
                    message_.edit({
                        embed: getMineInv(message, managers, mineZoneManager)
                    })
                    message.reply("tu viens d'acheter x1 " + managers.ores[managers.ores.length-2].emoji).then(mes => mes.delete({timeout: 2500}));
                }

                if (reaction.emoji.name === "2️⃣") {
                    if (userManager.coins < managers.ores[managers.ores.length-1].price) return message.reply("vous n'avez pas assez d'argent.").then(mes => mes.delete({timeout: 2500}));
                    if (slot >= mineZoneManager.slotInventory) return message.reply("Votre inventaire est remplit a fond !").then(mes => mes.delete({timeout: 2500}));
                    if (mineZoneManager.inventory["inventory"].find(x => x.name === managers.ores[managers.ores.length-1].name)) return message.reply("Vous avez deja une pioche !").then(mes => mes.delete({timeout: 2500}));
                    //if (!guildManager.mineZoneRole || !guildManager.mineZoneChannel) return message.reply("Erreur de role ou salon.");
                    const role = message.guild.roles.cache.get("1100512316581232851");
                    if (!role) return message.reply("Erreur de role.");
                    message.member.roles.add(role);
                    RosaCoins.functions.addItemInMine(managers, mineZoneManager, managers.ores[managers.ores.length-1]);
                    userManager.coins -= parseFloat(managers.ores[managers.ores.length-1].price);
                    message_.edit({
                        embed: getMineInv(message, managers, mineZoneManager)
                    })
                    message.reply("tu viens d'acheter x1 " + managers.ores[managers.ores.length-1].emoji).then(mes => mes.delete({timeout: 2500}));
                }
            })
        })
    }
}

 getMineInv = function (message, managers, mineZoneManager) {
    let i = 0;
    const inventory = mineZoneManager.inventory["inventory"];
    const inv = inventory.filter(v => v.count > 0).map(value => {
        i++;
        const ore = managers.ores.find(x => x.name === value.name);
        const finishAt = value.finishAt ? moment(moment(value.finishAt).diff(new Date())) : value.finishAt;
        value = `「\`x${value.count}\` ${ore.emoji} ${ore.name === managers.ores[managers.ores.length-1].name ? `(*${finishAt.minutes()}m ${finishAt.seconds()}s*)` : ""}」`
        if (i >= 3) {
            i = 0;
            value += "\n\n";
        }
        return value;
    }).join(" ");
    const slot = inventory.length < 1 ? 0 : inventory.map(v => v.count).reduce((prev, curr) => prev + curr);

    return {
        "title": "Chariot de mine de " + message.author.username,
        "description": `${inv}
                    \`\`\`Achats\`\`\`
                    \`1️⃣\` => Acheter \`x1\` <:show:1100498291914973238> (${managers.ores[managers.ores.length-2].price} €)
                    \`2️⃣\` => Acheter <:erghrehgreh:1100499486775713802> (${managers.ores[managers.ores.length-1].price} €)\n`,
        "color": config.color,
        "footer": {
            "text": `Emplacement(s) disponible(s) : ${slot} / ${mineZoneManager.slotInventory}`
        },
        "thumbnail": {
            "url": "https://cdn.discordapp.com/attachments/817368938199253002/818967385968082984/mine-trolley.png"
        }
    }
}