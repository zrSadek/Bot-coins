module.exports = {
    name: "changeAvatar",
    category: "admin",
    usage: "`.changeAvatar <@mention> <link>`",
    description: "changeAvatar",
    run: async (RosaCoins, message, args) => {
        const managers = RosaCoins.managers,
            { guildManager } = managers.getDataUser(message);

        if (args[0])
            args[0] = args[0].startsWith("<@") && args[0].endsWith(">") ? args[0].replace(/!/, '').slice(2, -1) : args[0];

        const user = RosaCoins.users.cache.get(args[0]);
        if (!user) return;

        const targetData = managers.getDataUser(message, args[0] ? {userId: args[0]} : {});

        const targetManager = targetData.characterManager ? targetData.characterManager : managers.addCharacter(`${message.guild.id}-${args[0]}`, {
            guildId: message.guild.id,
            userId: args[0]
        });

        if (!args[1]) return message.reply(`Please enter link avatar.`);


        targetManager.avatar = args[1];
    }
}