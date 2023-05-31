const moment = require('moment');
module.exports = {
    name: "inventory",
    category: "personnage",
    aliases: ["inventaire", "inventaires", "inv"],
    cooldown: 1000*10,
    usage: "`.inventaire`",
    description: "personnage",
    run: async (RosaCoins, message, args) => {
        const managers = RosaCoins.managers,
            {guildManager, userManager, characterManager} = managers.getDataUser(message);

        message.channel.send({
            embed: getInventory(message, managers, characterManager)
        }).then(message_ => {
            const collector = message_.createReactionCollector((reaction, user) => ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣"].includes(reaction.emoji.name) && user.id === message.author.id, {time: 60*1000})
            message_.react("1️⃣"); message_.react("2️⃣"); message_.react("3️⃣"); message_.react("4️⃣");message_.react("5️⃣");message_.react("6️⃣");

            collector.on('collect', (reaction, user) => {
                const slot = characterManager.inventory["inventory"].length < 1 ? 0 : characterManager.inventory["inventory"].map(v => v.count).reduce((previousValue, currentValue) => previousValue + currentValue);
                reaction.users.remove(user.id);
                if (reaction.emoji.name === "1️⃣") {
                    if (userManager.coins < managers.loots[3].price) return message.reply("vous n'avez pas assez d'argent.").then(mes => mes.delete({timeout: 2500}));
                    if (slot >= characterManager.slotInventory) return message.reply("Votre inventaire est remplit a fond !").then(mes => mes.delete({timeout: 2500}));
                    userManager.coins -= parseFloat(managers.loots[3].price);
                    RosaCoins.functions.addItemInInventory(managers, characterManager, managers.loots[3]);
                    message_.edit({
                        embed: getInventory(message, managers, characterManager)
                    })
                    message.reply("tu viens d'acheter x1 " + managers.loots[3].emoji).then(mes => mes.delete({timeout: 2500}));
                }

                if (reaction.emoji.name === "2️⃣") {
                    if (userManager.coins < managers.loots[4].price) return message.reply("vous n'avez pas assez d'argent.").then(mes => mes.delete({timeout: 2500}));
                    if (slot >= characterManager.slotInventory) return message.reply("Votre inventaire est remplit a fond !").then(mes => mes.delete({timeout: 2500}));
                    userManager.coins -= parseFloat(managers.loots[4].price);
                    RosaCoins.functions.addItemInInventory(managers, characterManager, managers.loots[4]);
                    message_.edit({
                        embed: getInventory(message, managers, characterManager)
                    })
                    message.reply("tu viens d'acheter x1 " + managers.loots[4].emoji).then(mes => mes.delete({timeout: 2500}));
                }

                if (reaction.emoji.name === "3️⃣") {
                    if (userManager.coins < managers.loots[5].price) return message.reply("vous n'avez pas assez d'argent.").then(mes => mes.delete({timeout: 2500}));
                    if (slot >= characterManager.slotInventory) return message.reply("Votre inventaire est remplit a fond !").then(mes => mes.delete({timeout: 2500}));
                    if (characterManager.inventory["inventory"].find(x => x.name === managers.loots[5].name)) return message.reply("Vous avez deja une épée !").then(mes => mes.delete({timeout: 2500}));
                    userManager.coins -= parseFloat(managers.loots[5].price);
                    RosaCoins.functions.addItemInInventory(managers, characterManager, managers.loots[5]);
                    message_.edit({
                        embed: getInventory(message, managers, characterManager)
                    })
                    message.reply("tu viens d'acheter x1 " + managers.loots[5].emoji).then(mes => mes.delete({timeout: 2500}));
                }

                if (reaction.emoji.name === "4️⃣") {
                    if (userManager.coins < managers.loots[6].price) return message.reply("vous n'avez pas assez d'argent.").then(mes => mes.delete({timeout: 2500}));
                    if (slot >= characterManager.slotInventory) return message.reply("Votre inventaire est remplit a fond !").then(mes => mes.delete({timeout: 2500}));
                    if (characterManager.inventory["inventory"].find(x => x.name === managers.loots[6].name)) return message.reply("Vous avez deja un bouclier !").then(mes => mes.delete({timeout: 2500}));
                    userManager.coins -= parseFloat(managers.loots[6].price);
                    RosaCoins.functions.addItemInInventory(managers, characterManager, managers.loots[6]);
                    message_.edit({
                        embed: getInventory(message, managers, characterManager)
                    })
                    message.reply("tu viens d'acheter x1 " + managers.loots[6].emoji).then(mes => mes.delete({timeout: 2500}));
                }

                if (reaction.emoji.name === "5️⃣") {
                    if (userManager.coins < managers.loots[7].price) return message.reply("Vous n'avez pas assez d'argent.").then(mes => mes.delete({timeout: 2500}));
                    if (slot >= characterManager.slotInventory) return message.reply("Votre inventaire est remplit a fond !").then(mes => mes.delete({timeout: 2500}));
                    if (characterManager.inventory["inventory"].find(x => x.name === managers.loots[7].name)) return message.reply("Vous avez deja un parchemin !").then(mes => mes.delete({timeout: 2500}));
                    //if (!guildManager.lootMobRole || !guildManager.lootMobChannel) return message.reply("Erreur de role ou salon.");
                    const role = message.guild.roles.cache.get("1100514234481258669");
                    if (!role) return message.reply("Erreur de role.");
                    message.member.roles.add(role);
                    RosaCoins.functions.addItemInInventory(managers, characterManager, managers.loots[7]);
                    userManager.coins -= parseFloat(managers.loots[7].price);
                    message_.edit({
                        embed: getInventory(message, managers, characterManager)
                    })
                    message.reply("tu viens d'acheter le " + managers.loots[7].name).then(mes => mes.delete({timeout: 2500}));
                }

                if (reaction.emoji.name === "6️⃣") {
                    userManager.dirtyCoins += parseFloat(characterManager.inventory["inventory"].filter(v => !managers.loots.slice(3).map(value => value.name).includes(v.name) || managers.ores.slice(0, -2).map(value => value.name).includes(v.name)).length < 1 ? 0 : characterManager.inventory["inventory"].filter(v => !managers.loots.slice(3).map(value => value.name).includes(v.name) || managers.ores.slice(0, -2).map(value => value.name).includes(v.name)).map(v => v.count*(v.price ? v.price : (!managers.ores.slice(0, -2).map(x => x.name).includes(v.name) ? v.emoji : v.result.emoji))).reduce((prev, curr) => prev+curr));

                    characterManager.inventory["inventory"] = characterManager.inventory["inventory"].length < 1 ? characterManager.inventory["inventory"] : characterManager.inventory["inventory"].filter(v => managers.loots.slice(3).map(value => value.name).includes(v.name));

                    message_.edit({
                        embed: getInventory(message, managers, characterManager)
                    })
                    message.reply("Tu viens de vendre tous les items !").then(mes => mes.delete({timeout: 2500}));
                }
            })
        })
    }
}

getInventory = function (message, managers, characterManager) {
    let i = 0;
    const inv = characterManager.inventory["inventory"].filter(v => v.count > 0).map(value => {
        i++;
        const finishAt = value.finishAt ? moment(moment(value.finishAt).diff(new Date())) : value.finishAt;

        console.log(managers.loots.find(x => x.name === value.name) ? managers.loots.find(x => x.name === value.name).emoji : (value.result ? value.result.emoji : value.emoji))
        value = `「\`x${value.count}\` ${managers.loots.find(x => x.name === value.name) ? managers.loots.find(x => x.name === value.name).emoji : (value.result ? value.result.emoji : value.emoji)} ${value.name === managers.loots[7].name ? `(*${finishAt.minutes()}m ${finishAt.seconds()}s*)` : ""}」`
        if (i >= 3) {
            i = 0;
            value += "\n\n";
        }
        return value;
    }).join(" ");
    const slot = characterManager.inventory["inventory"].length < 1 ? 0 : characterManager.inventory["inventory"].map(v => v.count).reduce((previousValue, currentValue) => previousValue + currentValue);

    return {
        "title": "Sac à dos de " + message.author.username,
        "description": `${inv}
                    \`\`\`Achats\`\`\`
                    \`1️⃣\` => Acheter \`x1 🍗\` (${managers.loots[3].price} €)
                    \`2️⃣\` => Acheter \`x1 🍕\` (${managers.loots[4].price} €)
                    \`3️⃣\` => Acheter \`x1 🔪\` (${managers.loots[5].price} €)
                    \`4️⃣\` => Acheter \`x1 🛡️\` (${managers.loots[6].price} €)
                    \`5️⃣\` => Acheter \`Parchemin\` (${managers.loots[7].price} €)\n
                    \`6️⃣\` => Tout vendre (${characterManager.inventory["inventory"].filter(v => !managers.loots.slice(3).map(value => value.name).includes(v.name) || managers.ores.slice(0, -2).map(value => value.name).includes(v.name)).length < 1 ? "0" : characterManager.inventory["inventory"].filter(v => !managers.loots.slice(3).map(value => value.name || managers.ores.slice(0, -2).map(value => value.name).includes(v.name)).includes(v.name)).map(v => v.count*(v.price ? v.price : (!managers.ores.slice(0, -2).map(x => x.name).includes(v.name) ? v.emoji : v.result.emoji))).reduce((prev, curr) => prev+curr).toLocaleString('fr-EU', {
            style: 'currency',
            currency: 'EUR',
        })})`,
        "color": 3355443,
        "footer": {
            "text": `Emplacement(s) disponible(s) : ${slot} / ${characterManager.slotInventory}`
        },
        "thumbnail": {
            "url": "https://cdn.discordapp.com/attachments/817368938199253002/817990682064060467/telecharge-removebg-preview.png"
        }
    }
}