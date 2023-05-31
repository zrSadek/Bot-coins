const config = require("../../config")

module.exports = {
    name: "deposit",
    category: "team",
    aliases: ["depot"],
    cooldown: 1000*3,
    description: "deposit",
    usage: "`.deposit <coins>`",
    run: async (RosaCoins, message, args) => {
        const managers = RosaCoins.managers,
            { guildManager, userManager } = managers.getDataUser(message);
        if(!args[0]) return message.channel.send("Veuillez entrer un montant à déposer !");

        if (!isNaN(args[0])) {
            if (!userManager.teamName) return message.reply('Pas dans une team !');

            const { teamManager } = managers.getDataTeam(message, {
                teamName: userManager.teamName
            });

            if (!teamManager) return message.reply(`Une erreur de team est survenu !`);

            if (parseFloat(args[0]) > 0 && userManager.coins >= parseFloat(args[0])) {
                userManager.coins -= parseFloat(args[0]);
                teamManager.bank += parseFloat(args[0]);

                message.channel.send({
                    embed: {
                        description: `Vous avez déposé **${parseFloat(args[0]).toFixed(2)} €** dans votre team **${teamManager.teamName}**.`,
                        color: config.color
                    }
                })
            }else
                message.reply('Soit le montant est invalide, soit vous n\'avez pas assez d\'argent !');
        }
    }
}