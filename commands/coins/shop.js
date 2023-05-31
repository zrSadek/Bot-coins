const config = require("../../config")

module.exports = {
    name: "shop",
    aliases: ["boutique"],
    category: "coins",
    cooldown: 1000*10,
    description: "shop",
    usage: "`.shop`",
    run: async (RosaCoins, message, args) => {
        const managers = RosaCoins.managers;
        const { guildManager, userManager, printerManager } = managers.getDataUser(message);

        message.channel.send({
            embed: {
                title: 'LA BOUTIQUE | ' + message.guild.name,
                color: config.color,
                description: 'Après un achat, aucun remboursement n\'est possible.',
                fields: [
                    {
                        name: 'Voici les arcticles :',
                        value: ` \n**Article 1 - Création de team <:members:1100522019235319960> [ 10 000 € ]**
                        → Créer votre propre team, gerez la pour être le numéro 1 du serveur.\n
                        **Article 2 - Achat printer 🖨 [ 25 000 € ]**
                        → Vous permet de gagner de l'argent sans rien n'avoir a faire.\n
                        **Article 3 - Achat VIP <:star1:1100535608092393513> [ 1 000 000 € ]**
                        → Avoir un rôle affiché en haut dans la liste des rôles.`
                    }
                ]
            }
        }).then(message_ => {
            const collector = message_.createReactionCollector((reaction, user) => ["1️⃣", "2️⃣", "3️⃣"].includes(reaction.emoji.name) && user.id === message.author.id, {max: 1, time: 30000})
            message_.react("1️⃣"); message_.react("2️⃣"); message_.react("3️⃣")
            collector.on('collect', (reaction, user) => {
                if (reaction.emoji.name === "1️⃣") {
                    if (!userManager) return message.reply("Tu n'est pas dans la base de donnée.");
                    if (userManager.teamName) return message.reply("Tu es déjà dans une team !")
                    if (userManager.coins < 10000) return message.reply("Vous n'avez pas assez d'argent...");
                    message.guild.channels.create(`shop-${Math.random()}`, {
                        type: 'text',
                        parent: "1100525998866452621",
                        permissionOverwrites: [
                            {
                                id: message.guild.roles.everyone.id,
                                deny: 'VIEW_CHANNEL'
                            },
                            {
                                id: message.author.id,
                                allow: 'VIEW_CHANNEL'
                            }
                        ]
                    }).then(textChannel => {
                        message.channel.send(`**Merci pour votre achat, cliquez sur ce salon pour finaliser votre commande** [${textChannel}]`)
                        textChannel.send({
                            embed: {
                                title: "**Choisissez le nom que vous désirez pour votre team **",
                                footer: {
                                    text: 'Vous avez 5 minutes pour entrer le nom.'
                                }
                            }
                        })
                        textChannel.awaitMessages(m => m.author.id === message.author.id, {max: 1, time: 300000})
                            .then(async collected => {
                                const roleName = collected.first().content;
                                if (!roleName || roleName.length < 1) return textChannel.send("**Erreur lors de la commande, veuillez contacter un technicien**");

                                const dataTeam = managers.getDataTeam(message, {teamName: roleName});

                                if (dataTeam.teamManager) return textChannel.send("**Erreur lors de la commande, veuillez contacter un technicien**, (team existante !)");
                                textChannel.send({
                                    embed: {
                                        title: "**Choisissez la couleur que vous désirez pour votre team **",
                                        description: "Ps : *Vous pouvez cliquer [__ici__](https://www.color-hex.com) pour trouver les couleurs*",
                                        footer: {
                                            text: `Vous avez 5 minutes pour entrer le code hex.`
                                        },
                                        color: config.color
                                    }
                                })

                                textChannel.awaitMessages(m => m.author.id === message.author.id, {max: 1, time: 300000})
                                    .then(collected => {
                                        const roleColor = collected.first().content;
                                        if (!roleColor || roleColor.length < 1) return textChannel.send("**Erreur lors de la commande, veuillez contacter un technicien**");
                                        if (!(/^#([0-9A-F]{3}){1,2}$/i.test((roleColor.startsWith("#") ? roleColor : `#${roleColor}`).replace(/ /g, '')))) return textChannel.send("**Erreur lors de la commande, veuillez contacter un technicien**")
                                        message.guild.roles.create({
                                            data: {
                                                name: roleName,
                                                color: roleColor.replace(/#/, '').replace(/ /g, '')
                                            }
                                        }).then(async role => {
                                            let member = message.guild.members.cache.get(user.id)
                                            member.roles.add(role);
                                            const textTeam =   await message.guild.channels.create(roleName, {
                                                type: "text",
                                                permissionOverwrites: [
                                                    {
                                                        id: message.guild.roles.everyone.id,
                                                        deny: 'VIEW_CHANNEL'
                                                    },
                                                    {
                                                        id: role.id,
                                                        allow: "VIEW_CHANNEL"
                                                    },
                                                    {
                                                        id: message.author.id,
                                                        allow: ["MANAGE_CHANNELS"]
                                                    }
                                                ],
                                                userLimit: 99,
                                                
                                            }) ;

                                            managers.addTeam(`${message.guild.id}-${roleName}`, {
                                                guildId: message.guild.id,
                                                teamName: roleName,
                                                ownerId: message.author.id,
                                                roleId: role ? role.id : null,
                                                textId: textTeam ? textTeam.id : null
                                            })

                                            userManager.teamName = roleName;
                                            userManager.coins -= 10000;
                                            textChannel.send("**Votre commande à été finalisée**")
                                            setTimeout(() => {
                                                textChannel.delete();
                                            }, 5000)
                                        })
                                    }).catch(() => {
                                    textChannel.send("**Temps écoulé, si vous n'avez pas eu le temps veuillez contacter un technicien**");
                                    textChannel.delete();
                                })
                            })
                    })

                } else if (reaction.emoji.name === "2️⃣") {
                    if (!userManager) return message.reply("Tu n'est pas dans la db.");
                    if (printerManager) return message.reply("Tu as deja un printer !")
                    if (userManager.coins < 25000) return message.reply("Vous n'avez pas assez d'argent...");
                    managers.addPrinter(`${message.guild.id}-${message.author.id}`, {
                        guildId: message.guild.id,
                        userId: message.author.id
                    })
                    userManager.coins -= 25000;
                    message.reply("Vous venez d'acheté un printer !")

                } else if (reaction.emoji.name === "3️⃣") {
                    const guildRole = message.guild.roles.resolve("1100538351968333855");
                    if (!userManager) return message.reply("Tu n'est pas dans la db.");
                    if (userManager.coins < 1000000) return message.reply("Vous n'avez pas assez d'argent...");
                    if (message.member.roles.cache.has("1100538351968333855"))
                    return message.reply(`Vous avez déjà le rôle VIP`)
                    else if (message.member.roles.add(guildRole).catch(err => message.reply("Erreur: " + err.message)))
                    
                    userManager.coins -= 1000000;
                    message.reply("Vous venez d'acheter le rôle VIP !")
                }
            })
        })

    }
}