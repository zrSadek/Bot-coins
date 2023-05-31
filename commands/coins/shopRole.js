module.exports = {
    name: "shopRole",
    aliases: ["roleShop"],
    category: "coins",
    cooldown: 1000*12,
    description: "shopRole",
    usage: "`.shopRole`",
    run: async (RosaCoins, message, args) => {
        const managers = RosaCoins.managers;
        const { guildManager, userManager } = managers.getDataUser(message);

        const roles = guildManager.shopRoles["shopRoles"] ? guildManager.shopRoles["shopRoles"].filter(role => message.guild.roles.resolve(role.id)) : null;
	if (!roles) return;
        let emoji = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"]


        message.channel.send({
            embed: {
                title: `Role boutique | ${message.guild.name}`,
                description: `${roles.map((role, index) => `\`${emoji[index]}\` 》  <@&${role.id}> 》 ${role.price.toLocaleString('fr-EU', {
                    style: 'currency',
                    currency: 'EUR',
                })}`).join("\n\n")}`
            }
        }).then(mes => {
            emoji = emoji.slice(0, emoji.length-(emoji.length-roles.length));

            const collector = mes.createReactionCollector((reaction, user) => emoji.includes(reaction.emoji.name) && user.id === message.author.id, {max: 1, time: 30000})
            emoji.forEach(emo => mes.react(emo));
            collector.on("collect", (reaction, user) => {

                const role = roles[emoji.findIndex(element => element === reaction.emoji.name)];
                if (!role) return;
                const guildRole = message.guild.roles.resolve(role.id);
                if (!guildRole) return;
                if (message.member.roles.cache.has(role.id))
                    return message.reply(`Vous avez deja ce role ! (\`${guildRole.name}\`)`)

                if (!userManager) return message.reply("Tu n'est pas dans la db.");
                if (userManager.coins < role.price) return message.reply(" vous n'avez pas assez d'argent...");
                message.member.roles.add(guildRole).catch(err => message.reply("Erreur: " + err.message)).then(() => {
                    userManager.coins -= role.price;
                    message.reply("Vous venez d'acheté le role `" + guildRole.name + "`")
                })
            })
        })
    }
}