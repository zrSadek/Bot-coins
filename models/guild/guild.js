module.exports = function (database, DataTypes) {
    try {
        database.define('guilds', {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            guildId: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            wl: {
                type: DataTypes.JSON,
                allowNull: true
            },

            shopRoles: {
                type: DataTypes.JSON,
                allowNull: true
            },

            channelVoiceTeam: {
                type: DataTypes.TEXT,
                allowNull: false
            },

            categoryTextTeam: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            channelLogs: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            channelLogsEnchere: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            lootMobChannel: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            lootMobRole: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            bleachingChannel: {
                type: DataTypes.TEXT,
                allowNull: true
            },


            mineZoneChannel: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            mineZoneRole: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            foundryChannel: {
                type: DataTypes.TEXT,
                allowNull: true
            },

            globalBoost: {
                type: DataTypes.FLOAT,
                allowNull: true
            }
        }, {
            timestamps: false,
            tableName: 'guilds'
        })
        return database.models.guilds;
    }catch (e) {}
}