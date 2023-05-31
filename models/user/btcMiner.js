module.exports = function (database, DataTypes) {
    try {
        database.define('btcMiner', {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            guildId: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            userId: {
                type: DataTypes.TEXT,
                allowNull: true
            },

            graphicCards: {
                type: DataTypes.JSON,
                allowNull: false,
            },

            inventory: {
                type: DataTypes.JSON,
                allowNull: false
            },
            slotInventory: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        }, {
            timestamps: false,
            tableName: 'btcMiner'
        })
        return database.models.btcMiner;
    }catch (e) {}
}