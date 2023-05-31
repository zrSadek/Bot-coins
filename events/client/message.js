const cooldown = new Set();
module.exports = async (RosaCoins, message) => {
    const prefix = RosaCoins.config.prefix;
    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.content.startsWith(prefix)) return;
    if ((!RosaCoins.open || RosaCoins.lock) && !["1071188330915561593"].includes(message.author.id)) return;
    if (!message.member) message.member = await message.guild.fetchMember(message);
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    if (cmd.length === 0) return;
    let command = RosaCoins.commands.get(cmd);
    if (!command) {
        if (RosaCoins.aliases.get(cmd))
            command = RosaCoins.commands.get(RosaCoins.aliases.get(cmd).toLowerCase());
    }
    if (command) {
        if (command.cooldown) {
            if (cooldown.has(`${message.guild.id}-${message.author.id}-${command.name}`))
                return message.reply('Calme, reessaye dans quelque secondes.');

            cooldown.add(`${message.guild.id}-${message.author.id}-${command.name}`)
            setTimeout(() => {
                cooldown.delete(`${message.guild.id}-${message.author.id}-${command.name}`)
            }, command.cooldown)
        }
        command.run(RosaCoins, message, args);
    }
}