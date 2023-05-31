module.exports = function (database, DataTypes) {
    try {
        database.define('characters', {
            guildId: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            userId: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            avatar: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            health: {
                type: DataTypes.FLOAT,
                allowNull: true
            },
            food: {
                type: DataTypes.FLOAT,
                allowNull: true
            },
            level: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            xp: {
                type: DataTypes.INTEGER,
                allowNull: true
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
            tableName: 'characters',
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci'
        })
        return database.models.characters;
    }catch (e) {}
}