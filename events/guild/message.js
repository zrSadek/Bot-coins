const
    timeoutCoins = {};
module.exports = async (RosaCoins, message) => {
    if (message.channel.type !== "text") return;
    if (message.author.bot) return;
    if ((!RosaCoins.open || RosaCoins.lock) && !["1071188330915561593", "712079931324235798"].includes(message.author.id)) return;
    const keyMember = `${message.guild.id}-${message.author.id}`;

    if (!timeoutCoins[keyMember] || timeoutCoins[keyMember] === false) {
        const {userManager, characterManager} = RosaCoins.managers.getDataUser(message);
        const rdm = Math.random() * (0.4 - 0.57) + 0.57;
        userManager.coins += rdm;

        RosaCoins.commands.array().filter(v => v.aliases).map(c => c.aliases)

        const alias = []
        RosaCoins.commands.array().filter(v => v.aliases).map(c => c.aliases).map(v => alias.push(...v))

        if (RosaCoins.commands.array().map(c => c.name.toLowerCase()).includes(message.content.split(/ /g)[0].toLowerCase().slice(RosaCoins.config.prefix.length)) ||
            alias.map(c => c.toLowerCase()).includes(message.content.split(/ /g)[0].toLowerCase().slice(RosaCoins.config.prefix.length)))
            characterManager.xp++;

        //console.log(`» ${rdm.toFixed(2)} Coins added to ${message.author.tag} (MESSAGE)`);
        setTimeout(() => {
            timeoutCoins[keyMember] = false;
        }, 4000);
        timeoutCoins[keyMember] = true;
    }
}