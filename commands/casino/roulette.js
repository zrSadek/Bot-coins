const isStarted = {};
const config = require("../../config")

module.exports = {
    name: "roulette",
    category: "casino",
    description: "roulette",
    usage: "`.roulette`",
    run: async (RosaCoins, message, args) => {
        const managers = RosaCoins.managers,
            { guildManager } = managers.getDataUser(message);

        if(isStarted[message.channel.id]) return message.channel.send("Vous avez déjà start la roulette automatique dans ce salon !");
        isStarted[message.channel.id] = true;

        //let msg = message.channel.send(`Roulette starting, wait..`);

            const mise = Math.random() * (5 - 250) + 250;
            let one = new Map(),
                two = new Map(),
                three = new Map();

            message.channel.send({
                embed: {
                    title: 'En attente des mises...',
                    color: config.color,
                    description: `La mise est de **${mise.toFixed(2)} €** \n
                🔴 Rouge (**x2**)\n
                ⚫ Noir (**x2**)\n
                🟢 Vert (**x5**)\n
                Vous avez 30 secondes pour choisir.`,
                    image: {
                        url: 'https://thumbs.gfycat.com/LivelyObviousAnhinga-size_restricted.gif'
                    }
                }
            }).then(message => {
                const collector = message.createReactionCollector((reaction, user) => ['🔴', '⚫', '🟢'].includes(reaction.emoji.name), { time: 30000 });
                message.react("🔴"); message.react("⚫"); message.react("🟢");

                collector.on('collect', ((reaction, user) => {
                    if (!user.bot) {
                        const {userManager} = managers.getDataUser(message, {
                            userId: user.id
                        })
                        if (userManager) {
                            if (userManager.coins >= mise) {
                                if (reaction.emoji.name === "🔴")
                                    one.set(user.id, true);
                                else if(reaction.emoji.name === '⚫')
                                    two.set(user.id, true);
                                else
                                    three.set(user.id, true);
                            }else {
                                message.channel.send(`<@${user.id}>, Vous n'avez pas assez d'argent.`).then(mes => mes.delete({timeout: 1000}));
                            }
                        }
                    }
                }))
                    .on('end', collection => {
                        if (message) {
                            const rdm = Math.floor(Math.random()*38);


                            one.forEach((value, key) => {
                                if (!collection.get("🔴").users.cache.has(key))
                                    one.delete(key);
                            })

                            two.forEach((value, key) => {
                                if (!collection.get("⚫").users.cache.has(key))
                                    two.delete(key);
                            })

                            three.forEach((value, key) => {
                                if (!collection.get("🟢").users.cache.has(key))
                                    three.delete(key);
                            })

                            let winner,
                                looser;

                            winner = rdm < 18 ? collection.get("🔴").users.cache.filter(user => one.has(user.id)) : (rdm > 36 ? collection.get("🟢").users.cache.filter(user => three.has(user.id)) : collection.get("⚫").users.cache.filter(user => two.has(user.id)));
                            looser = rdm < 18 ? collection.get("⚫").users.cache.filter(user => two.has(user.id)).concat(collection.get("🟢").users.cache.filter(user => three.has(user.id))) : (rdm > 36 ? collection.get("⚫").users.cache.filter(user => two.has(user.id)).concat(collection.get("🔴").users.cache.filter(user => one.has(user.id))) : collection.get("🟢").users.cache.filter(user => three.has(user.id)).concat(collection.get("🔴").users.cache.filter(user => one.has(user.id))))
                            winner.filter(user => looser.has(user.id)).forEach(user => {
                                winner.delete(user.id)
                                looser.delete(user.id)
                                message.channel.send(`<@${user.id}>, Interdiction de mettre plusieur case !`).then(mes => mes.delete({timeout: 1000}));
                            })

                            winner.forEach(user => managers.getDataUser(message, {userId: user.id}).coins += mise)
                            looser.forEach(user => managers.getDataUser(message, {userId: user.id}).coins -= mise)

                            let member;
                            if (winner.size < 1) member = "La gagnant est"
                            else if (winner.size > 1) member = "Les gagants sont"

                            message.edit( {
                                embed: {
                                    title: `**${rdm < 18 ? 'Rouge' : (rdm > 36 ? 'Vert' : 'Noir')} !** (Mise: ${mise.toFixed(2)} Coins)`,
                                    title: `Les résultats !`,
                                    description: `${member} : \n${winner.size < 1 ? 'Aucun' : winner.array().join(', ')}`,
                                    thumbnail: {
                                        url: rdm < 18 ? 'https://media.discordapp.net/attachments/811629393842929704/811710862556790804/58afdad6829958a978a4a693.png' : (rdm > 36 ? 'https://cdn.discordapp.com/attachments/811629393842929704/811711080119402496/cercle-vert-fond-transparent.png' : 'https://cdn.discordapp.com/attachments/811629393842929704/811710909399040000/cercle-noir-fond-transparent.png')
                                    }
                                }
                            })
                            message.channel.send(`${winner.size < 1 ? 'Aucun' : winner.array().join(', ')}`).then(mes => mes.delete()).catch(() => {})
                        }
                    })
            })
    }
}