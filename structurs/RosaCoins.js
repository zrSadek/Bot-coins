const {Client, Collection, WebhookClient, MessageAttachment} = require('discord.js'),
    {Sequelize, DataTypes} = require('sequelize'),
    {EventHandler, CommandHandler} = require('../utils/Handlers'),
    {Managers} = require('../managers');

class RosaCoins extends Client {
    constructor(props) {
        super(props);

        this.config = require('../config');
        this.webhookClient = new WebhookClient(this.config.webhook.id, this.config.webhook.token);

        this.open = true;
        this.lock = false;

        this.functions = require('../utils/functions');

        this.functions.startAutoBackupDatabase(this, MessageAttachment, (60*1000)*15);


        this.database = new Sequelize({
            dialect: 'sqlite',
            storage: `./rosaCoins.sqlite`,
            logging: false
        });

        // Collections
        this.commands = new Collection();
        this.aliases = new Collection();

        this.managers = new Managers(this);

        new EventHandler(this);
        new CommandHandler(this);

        try {
            this.database.authenticate().then(async () => {
                require(`../models/guild/guild`)(this.database, DataTypes)

                require(`../models/user/user`)(this.database, DataTypes)
                require(`../models/user/printer`)(this.database, DataTypes)
                require(`../models/user/character`)(this.database, DataTypes)

                require(`../models/user/mineZone`)(this.database, DataTypes)

                require(`../models/team/team`)(this.database, DataTypes)
                await this.database.sync();
                await this.managers.loadDatabase();
                console.log('Connection has been established successfully.');
            }).catch(error => console.error('Unable to connect to the database:', error))
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    }
}

exports.RosaCoins = RosaCoins;