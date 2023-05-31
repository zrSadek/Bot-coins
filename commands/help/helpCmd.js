module.exports = {
    name: "help",
    category: "help",
    cooldown: 1000*5,
    description: "help",
    run: async (RosaCoins, message, args) => {
        const managers = RosaCoins.managers,
            { guildManager, userManager, printerManager, characterManager, mineZoneManager } = managers.getDataUser(message);

        const embed = {
            description: ``
        };

        {
            embed.description += `\`\`\`Admin\`\`\`\n`;
            embed.description += RosaCoins.commands.filter(command => command.category.toLowerCase() === "admin").map(cmd => `» ${cmd.usage}`).join("\n");

            embed.description += `\n\`\`\`Casino\`\`\`\n`;
            embed.description += RosaCoins.commands.filter(command => command.category.toLowerCase() === "casino").map(cmd => `» ${cmd.usage}`).join("\n");
        }

        embed.description += `\n\`\`\`Coins\`\`\`\n`;
        embed.description += RosaCoins.commands.filter(command => command.category.toLowerCase() === "coins").map(cmd => `» ${cmd.usage}`).join("\n");

        if (userManager.teamName) {
            embed.description += `\n\`\`\`Teams\`\`\`\n`;
            embed.description += RosaCoins.commands.filter(command => command.category.toLowerCase() === "team").map(cmd => `» ${cmd.usage}`).join("\n");
        }

        if (printerManager) {
            embed.description += `\n\`\`\`Printer\`\`\`\n`;
            embed.description += RosaCoins.commands.filter(command => command.category.toLowerCase() === "printer").map(cmd => `» ${cmd.usage}`).join("\n");
        }

        if (characterManager) {
            embed.description += `\n\`\`\`Personnage\`\`\`\n`;
            embed.description += RosaCoins.commands.filter(command => command.category.toLowerCase() === "personnage").map(cmd => `» ${cmd.usage}`).join("\n");
        }

        if (mineZoneManager) {
            embed.description += `\n\`\`\`Mine\`\`\`\n`;
            embed.description += RosaCoins.commands.filter(command => command.category.toLowerCase() === "mine").map(cmd => `» ${cmd.usage}`).join("\n");
        }

        message.channel.send({
            embed
        })
    }
}