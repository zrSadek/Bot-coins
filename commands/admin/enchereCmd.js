module.exports = {
    name: "enchere",
    category: "admin",
    description: "enchere",
    usage: "`.enchere -n <name> -t <mins> -p <prix>`",
    run: async (RosaCoins, message, args) => {
        const managers = RosaCoins.managers,
            { guildManager } = managers.getDataUser(message);
        
        let enchereUSER = new Map();

        let enchereArgs = message.content.split("-n").join(',').split("-p").join(',').split("-t");
        let encherePrice = parseFloat(enchereArgs.toString().split(",")[3].substring(1));
        let enchereTime = enchereArgs.toString().split(",")[2].substring(1);
        let enchereName = enchereArgs.toString().split(",")[1].substring(1);
        let enchereChannel = message.guild.channels.resolve(message.channel.id);
        let enchereLogsChannel = message.guild.channels.resolve("1100407179665743922");
        let enchereLastPrice = encherePrice;
        let enchereLastUserId = "";

        message.channel.send(`Vous lancer une enchère pour ${enchereName}, l'enchère commence au prix de ${encherePrice} Coins et dureras ${enchereTime}mn`);

        let confirm = await enchereChannel.send({
            embed: {
                title: "Enchère: " + enchereName,
                description: `Pour participer à cette enchère, il suffit de cliquer sur la réaction.\n\n **__ Informations__**\nPrix de base: ${encherePrice} rosa coins\nDernier prix: ${enchereLastPrice} rosa coins\nDurée: ${enchereTime} minutes`,
                author: {
                    name: "Rosa"
                },
                image: {
                    url: "https://media.discordapp.net/attachments/781638663335444510/811643488935870594/Uvx6vZutMpsrH_3yNLcic_Lkd0HoIr7dxhSnEkrZlAY_iIiIdOlbwY5iGPlzq9I4f-vt7QA0l8U8L0cExg32HzIovi8O5jvs_5P6.png"
                }
            }
        });

        confirm.react("✅");

        const filter = (reaction, user) => {
            return ['✅'].includes(reaction.emoji.name) && !user.bot;
        };

        const collector = confirm.createReactionCollector(filter, {
            time: (enchereTime * 60000)
        });

        collector.on("collect", async (reaction, user) => {
            if (reaction.emoji.name === '✅') {
                enchereLastPrice = parseFloat(enchereLastPrice);
                const {userManager} = managers.getDataUser(message, {userId: user.id});

                //if (!guildManager.wl['wl'].includes(user.id))
                  //  reaction.users.remove(user.id);

                if(user.id === enchereLastUserId) {
                    return enchereChannel.send("<@" + user.id + "> Vous êtes déjà à la tête de l'enchère !").then(m => m.delete({timeout: 2500}));
                }
                if (!userManager || userManager.coins < enchereLastPrice) {
                    return enchereChannel.send("<@" + user.id + ">Vous n'avez pas assez d'argent.").then(m => m.delete({timeout: 2500}));
                }
                enchereUSER.set(user.id, enchereLastPrice);
                enchereLastPrice += encherePrice;
                enchereLastUserId = user.id;
                confirm.edit({
                    embed: {
                        title: "Enchère: " + enchereName,
                        description: `Pour participer à cette enchère, il suffit de cliquer sur la réaction.\n\n **__ Informations__**\nPrix de base: ${encherePrice} <a:rosaRose:792822115857465394> Coins\nDernier prix: ${enchereLastPrice} <a:rosaRose:792822115857465394> Coins\nDurée: ${enchereTime} minutes\nDernier Enchérisseur: <@${user.id}>`,
                        author: {
                            name: "Rosa"
                        },
                        image: {
                            url: "https://media.discordapp.net/attachments/781638663335444510/811643488935870594/Uvx6vZutMpsrH_3yNLcic_Lkd0HoIr7dxhSnEkrZlAY_iIiIdOlbwY5iGPlzq9I4f-vt7QA0l8U8L0cExg32HzIovi8O5jvs_5P6.png"
                        }
                    }
                })
                let en = await enchereChannel.send(`<@${user.id}> a enchérit pour __**${enchereLastPrice-encherePrice} <a:rosaRose:792822115857465394> Coins**__. Le prix est maintenant de __**${enchereLastPrice} <a:rosaRose:792822115857465394> Coins**__`);
                if (enchereLogsChannel)
                    enchereLogsChannel.send(`<@${user.id}> a enchérit pour __**${enchereLastPrice-encherePrice} <a:rosaRose:792822115857465394> Coins**__. Le prix est maintenant de __**${enchereLastPrice} <a:rosaRose:792822115857465394> Coins**__`);
                setTimeout(async () => {
                    en.delete();
                }, 3000);
            }
        });

        collector.on('end', () => {
            if (!enchereLastUserId) return message.channel.send(`Aucun gagnant`)
            enchereChannel.send({embed: {
                "title": "Adjugé vendu",
                "description": `Adjugé vendu à <@${enchereLastUserId}> pour __**${enchereLastPrice-encherePrice} <a:rosaRose:792822115857465394> Coins**__`,
                "color": null,
                "author": {
                  "name": "Rosa"
                },
                "image": {
                  "url": "https://radiococotier.nc/wp-content/uploads/2015/03/ench%C3%A8res.jpg"
                }
            }});

            const {userManager} = managers.getDataUser(message, {userId: enchereLastUserId})
            if (!userManager) return enchereChannel.send('Error user not init.')
            userManager.coins -= (enchereLastPrice-encherePrice);
        })
    }
}