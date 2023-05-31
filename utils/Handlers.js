const fs = require('fs');

class EventHandler {
    constructor(CasinoBot) {
        fs.readdir('./events', (err, files) => {
            if (err) throw err;
            files.forEach(file => {
                if (file.includes('.'))
                    this.registerFile(`../events/${file}`, CasinoBot);
                else
                    fs.readdir(`./events/${file}`, (err, files) => {
                        if (err) throw err;
                        files.forEach(file_ => {
                            if (file_.includes('.'))
                                this.registerFile(`../events/${file}/${file_}`, CasinoBot);
                        })
                    })
            })
        })
    }
    registerFile = function (file, CasinoBot) {
        const event = require(file);
        CasinoBot.on(file.split('/').pop().split('.')[0], event.bind(null, CasinoBot));
        delete require.cache[require.resolve(file)];
    }
}

class CommandHandler {
    constructor(CasinoBot) {
        fs.readdirSync("./commands/").forEach(dir => {
            const commands = fs.readdirSync(`./commands/${dir}/`).filter(file => file.endsWith(".js"));
            for (let file of commands) {
                let pull = require(`../commands/${dir}/${file}`);
                if (pull.name)
                    CasinoBot.commands.set(pull.name.toLowerCase(), pull);
                else
                    continue;
                if (pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach(alias => CasinoBot.aliases.set(alias.toLowerCase(), pull.name));
            }
        });
    }
}

module.exports = {
    EventHandler,
    CommandHandler
}