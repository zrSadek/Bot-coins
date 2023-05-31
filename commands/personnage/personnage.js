const Canvas = require('canvas'),
Discord = require('discord.js');
const config = require("../../config")

module.exports = {
    name: "personnage",
    category: "personnage",
    aliases: ["perso"],
    cooldown: 1000*10,
    usage: "`.personnage`",
    description: "personnage",
    run: async (RosaCoins, message, args) => {
        if (args[0])
            args[0] = args[0].startsWith("<@") && args[0].endsWith(">") ? args[0].replace(/!/, '').slice(2, -1) : args[0];

        const managers = RosaCoins.managers,
            {guildManager, userManager, characterManager} = managers.getDataUser(message, args[0] ? {userId: args[0]} : {});
            
        const user = RosaCoins.users.cache.get(userManager.userId);
        if (!user) return;
        message.author.username = args[0] ? user.username : message.author.username;
        if (!args[0] && characterManager.xp >= 500) {
            characterManager.xp = 0;
            characterManager.level++;
        }
        if (!args[0] && characterManager.level >= 100)
            characterManager.level = 100;

        message.channel.send(await personnageInv(message, characterManager, userManager))
            .then(message_ => {
                if (args[0]) return;
                const collector = message_.createReactionCollector((reaction, user) => [managers.loots[3].emoji, managers.loots[4].emoji].includes(reaction.emoji.name) && user.id === message.author.id, {time: 25*1000})
                message_.react(managers.loots[3].emoji); message_.react(managers.loots[4].emoji);
                collector.on('collect', async (reaction, user) => {
                    reaction.users.remove(user.id);
                    switch (reaction.emoji.name) {
                        case managers.loots[3].emoji:
                            if (!characterManager.inventory["inventory"].find(v => v.name === managers.loots[3].name) || characterManager.inventory["inventory"].find(v => v.name === managers.loots[3].name).count < 1) return message.reply("Vous n'avez pas de " + managers.loots[3].emoji).then(mes => mes.delete({timeout: 2500}));
                            characterManager.inventory["inventory"].map(value => {
                                if (managers.loots[3].name === value.name)
                                    value.count--;
                                return value;
                            })
                            characterManager.food += managers.loots[3].saturation;
                            if (characterManager.food > 100)
                                characterManager.food = 100;
                            message.reply("Vous venez de manger un " + managers.loots[3].emoji).then(mes => mes.delete({timeout: 2500}));
                            message_.edit(await personnageInv(message, characterManager, userManager));
                            break;

                        case managers.loots[4].emoji:
                            if (!characterManager.inventory["inventory"].find(v => v.name === managers.loots[4].name) || characterManager.inventory["inventory"].find(v => v.name === managers.loots[4].name).count < 1) return message.reply("Vous n'avez pas de " + managers.loots[4].emoji).then(mes => mes.delete({timeout: 2500}));
                            characterManager.inventory["inventory"].map(value => {
                                if (managers.loots[4].name === value.name)
                                    value.count--;
                                return value;
                            })
                            characterManager.food += managers.loots[4].saturation;
                            if (characterManager.food > 100)
                                characterManager.food = 100;
                            message.reply("Vous venez de manger un " + managers.loots[4].emoji).then(mes => mes.delete({timeout: 2500}));
                            message_.edit(await personnageInv(message, characterManager, userManager));
                            break;
                    }
                })
            })
    }
}

const applyText = (canvas, text) => {
    const ctx = canvas.getContext('2d');

    // Declare a base size of the font
    let fontSize = 70;

    do {
        // Assign the font to the context and decrement it so it can be measured again
        ctx.font = `${fontSize -= 10}px sans-serif`;
        // Compare pixel width of the text to the canvas minus the approximate avatar size
    } while (ctx.measureText(text).width > canvas.width - 300);

    // Return the result to use in the actual canvas
    return ctx.font;
};

personnageInv = async function (message, characterManager, userManager) {
    const canvas = Canvas.createCanvas(700, 270);
    const ctx = canvas.getContext('2d');

    ctx.font = applyText(canvas, `Xp`);
    ctx.fillStyle = '#fdd74f';
    ctx.fillText(`Xp`, canvas.width / 2, canvas.height / 1.2);

    ctx.font = '28px sans-serif';
    ctx.fillStyle = '#ffd300';
    ctx.fillText(`${characterManager.xp} / ${characterManager.level >= 100 ? " ∞" : "500"}`, canvas.width / 2.1, canvas.height);

    ctx.font = applyText(canvas, `Niveau `);
    ctx.fillStyle = '#69d4e2';
    ctx.fillText(`Niveau `, canvas.width / 3.5, 63);

    ctx.font = `${characterManager.level >= 100 ? "38" : "48"}px sans-serif`;
    ctx.fillStyle = '#6d94f6';
    ctx.fillText(characterManager.level, canvas.width / (characterManager.level >= 10 && characterManager.level < 100 ? 1.59 : (characterManager.level >= 100 ? 1.61 : 1.55)), characterManager.level < 100 ? 65 : 62);

    ctx.font = `bold ${38 - message.author.username.length}px sans-serif`;
    ctx.fillStyle = '#21e325';
    ctx.fillText(`${message.author.username}`, 0, 40);

    ctx.beginPath();
    ctx.arc(canvas.width / 1.5, 50, 45, 0, 2 * Math.PI, false);
    ctx.lineWidth = 7;
    ctx.strokeStyle = '#cfcfcf';
    ctx.stroke();

    const avatar = await Canvas.loadImage(characterManager.avatar.split("?")[0] + "?width=120&height=270").catch(() => {});
    ctx.drawImage(avatar, 15, 60, 110 / 1.3, 270 / 1.3);

    const items = ["🍔", "🍞", "🥐", "🥨", "🍗", "🍖", "🥩"]

    return new Discord.MessageEmbed()
        .setTitle(`Personnage de ${message.author.username}`)
        .setDescription(`
            **Argent :** ${userManager.coins.toLocaleString('fr-EU', {
            style: 'currency',
            currency: 'EUR',
        })}\n
             **Argent Sale :** ${userManager.dirtyCoins.toLocaleString('fr-EU', {
            style: 'currency',
            currency: 'EUR',
        })}\n
            **〃Vie :** \`${characterManager.health > 9 ? "💖".repeat(parseInt(characterManager.health.toString() === "100" ? 10 : characterManager.health.toString()[0])) : `${characterManager.health.toFixed(2)} PV`}\` (${characterManager.health.toFixed(2)} PV)\n
            **〃Faim :** \`${characterManager.food > 9 ? items[Math.floor(Math.random() * items.length)].repeat(parseInt(characterManager.food.toString() === "100" ? 10 : characterManager.food.toString()[0])) : `${characterManager.food.toFixed(2)} %`}\` (${characterManager.food.toFixed(2)}%)
            `)
        .attachFiles([{name: "image.png", attachment: canvas.toBuffer()}])
        .setThumbnail("https://cdn.discordapp.com/attachments/817368938199253002/817947138147090452/2Q-removebg-preview.png")
        .setImage('attachment://image.png')
        .setColor(config.color)
}