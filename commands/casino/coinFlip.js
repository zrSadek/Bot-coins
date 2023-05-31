const isStarted = {};

module.exports = {
    name: "coinFlip",
    category: "casino",
    description: "CoinFlips",
    usage: "`.coinFlip`",
    run: async (RosaCoins, message, args) => {
        const managers = RosaCoins.managers,
            { guildManager } = managers.getDataUser(message);

        if(isStarted[message.channel.id]) return message.channel.send("Vous avez déjà start le coinflip automatique dans ce salon !");
        isStarted[message.channel.id] = true;

        message.channel.send(`CoinsFlip starting, wait..`);

            const mise = Math.random() * (5 - 250) + 250;
            let one = new Map(),
                two = new Map();

            message.channel.send({
                embed: {
                    title: 'Pile ou Face ?',
                    description: `La mise est de **${mise.toFixed(2)} Coins** \n
                :one: pile (**x2**)\n
                :two: face (**x2**)\n
                Vous avez 30 secondes pour choisir.`,
                    image: {
                        url: 'https://acegif.com/wp-content/uploads/coin-flip.gif'
                    }
                }
            }).then(message => {
                const collector = message.createReactionCollector((reaction, user) => ['1️⃣', '2️⃣'].includes(reaction.emoji.name), { time: 30000 });
                message.react("1️⃣"); message.react("2️⃣")

                collector.on('collect', ((reaction, user) => {
                    if (!user.bot) {
                        const {userManager} = managers.getDataUser(message, {
                            userId: user.id
                        })
                        if (userManager) {
                            if (userManager.coins >= mise) {
                                if (reaction.emoji.name === "1️⃣")
                                    one.set(user.id, true);
                                else
                                    two.set(user.id, true);
                            }else {
                                reaction.users.remove(user);
                                message.channel.send(`<@${user.id}>, Vous n'avez pas assez d'argent.`).then(mes => mes.delete({timeout: 1000}));
                            }
                        }
                    }
                }))
                    .on('end', collection => {
                        if (message) {
                            const rdm = Math.floor(Math.random()*2);

                            one.forEach((value, key) => {
                                if (!collection.get("1️⃣").users.cache.has(key))
                                    one.delete(key);
                            })

                            two.forEach((value, key) => {
                                if (!collection.get("2️⃣").users.cache.has(key))
                                    two.delete(key);
                            })

                            const winner = rdm === 0 ? collection.get("1️⃣").users.cache.filter(user => one.has(user.id)) : collection.get("2️⃣").users.cache.filter(user => two.has(user.id));
                            const looser = rdm === 0 ? collection.get("2️⃣").users.cache.filter(user => two.has(user.id)) : collection.get("1️⃣").users.cache.filter(user => one.has(user.id));

                            winner.filter(user => looser.has(user.id)).forEach(user => {
                                winner.delete(user.id)
                                looser.delete(user.id)
                                message.channel.send(`<@${user.id}>, Interdiction de mettre Pile et Face ! `).then(mes => mes.delete({timeout: 1000}));
                            })
                            winner.forEach(user => managers.getDataUser(message, {userId: user.id}).coins += mise)
                            looser.forEach(user => managers.getDataUser(message, {userId: user.id}).coins -= mise)

                            message.edit({
                                embed: {
                                    title: `**${rdm === 0 ? 'Pïle' : 'Face'} !** (Mise: ${mise.toFixed(2)} Coins)`,
                                    description: 'Les gagnants sont: \n' +
                                        `${winner.size < 1 ? 'Aucun' : winner.array().join(', ')}`,
                                    image: {
                                        url: rdm === 0 ? 'https://cdn.discordapp.com/attachments/807610082586132520/810533609294266449/pile1-removebg-preview.png' : 'https://cdn.discordapp.com/attachments/807610082586132520/810533435789148160/face1-removebg-preview.png'
                                    }
                                }
                            })
                            message.channel.send(`${winner.size < 1 ? 'Aucun' : winner.array().join(', ')}`).then(mes => mes.delete()).catch(() => {})
                        }
                    })
            })
    }
}