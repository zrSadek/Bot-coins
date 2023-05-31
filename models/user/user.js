module.exports = function (database, DataTypes) {
    try {
        database.define('users', {
            guildId: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            userId: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            coins: {
                type: DataTypes.FLOAT,
                allowNull: true
            },
            bitcoin: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            dirtyCoins: {
                type: DataTypes.FLOAT,
                allowNull: true
            },
            teamName: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            transactions: {
                type: DataTypes.JSON,
                allowNull: false
            }
        }, {
            timestamps: false,
            tableName: 'users',
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci'
        })
        return database.models.users;
    }catch (e) {}
}