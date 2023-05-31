module.exports = function (database, DataTypes) {
    try {
        database.define('minezone', {
            guildId: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            userId: {
                type: DataTypes.TEXT,
                allowNull: false
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
            tableName: 'minezone',
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci'
        })
        return database.models.minezone;
    }catch (e) {}
}