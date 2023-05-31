module.exports = function (database, DataTypes) {
    try {
        database.define('printers', {
            guildId: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            userId: {
                type: DataTypes.TEXT,
                allowNull: true
            },

            printerLimitInk: {
                type: DataTypes.FLOAT,
                allowNull: true
            },
            printerLimitPaper: {
                type: DataTypes.FLOAT,
                allowNull: true
            },
            printerLimitBattery: {
                type: DataTypes.FLOAT,
                allowNull: true
            },

            printerInk: {
                type: DataTypes.FLOAT,
                allowNull: true
            },
            printerPaper: {
                type: DataTypes.FLOAT,
                allowNull: true
            },
            printerBattery: {
                type: DataTypes.FLOAT,
                allowNull: true
            },
            printerStatus: {
                type: DataTypes.BOOLEAN,
                allowNull: true
            },
            printerBank: {
                type: DataTypes.FLOAT,
                allowNull: true
            }
        }, {
            timestamps: false,
            tableName: 'printers'
        })
        return database.models.printers;
    }catch (e) {}
}