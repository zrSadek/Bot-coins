const paginationEmbed = require('discord.js-pagination');
const config = require("../../config")

module.exports = {
    name: "topTeam",
    category: "coins",
    aliases: ["teamTop"],
    description: "topTeam",
    usage: "`.topTeam`",
    cooldown: 10,
    run: async (RosaCoins, message, args) => {
        const managers = RosaCoins.managers;

        const topTeams = managers.teamManager.filter(teamManager => teamManager.guildId === message.guild.id).sort((firstValue, secondValue) => {
            return secondValue.bank - firstValue.bank;
        });
        const pages = [];
        let top = 0;
        RosaCoins.functions.chunk( topTeams.array(), 10).map(chunk => {
        message.channel.send({
                embed: {
                    color: config.color,
                    fields: chunk.map(team => {
                        top++;
                        return {
                            name: `${team.teamName}`,
                            value: `${team.bank.toFixed(2)} €`
                        }
                    })
                }
            })
            })
        //await paginationEmbed(message, pages,  ['⏪', '⏩'], 15000);
    }
}