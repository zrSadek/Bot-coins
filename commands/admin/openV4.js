module.exports = {
    name: "openV4",
    category: "admin",
    usage: "`.openV4`",
    description: "openV4",
    run: async (RosaCoins, message, args) => {
        const managers = RosaCoins.managers,
            {guildManager} = managers.getDataUser(message);

        RosaCoins.open = true;
        message.channel.send({
            embed: {
                description: `Je suis de retour ! En position, faite **explosé le compteur** ! \n\n Ancienne Statistiques: **22 000 Users**`
            }
        })
    }
}