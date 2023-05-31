module.exports = function (database, DataTypes) {
    try {
        database.define('teams', {
            guildId: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            teamName: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            ownerId: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            adminIds: {
                type: DataTypes.JSON,
                allowNull: true
            },
            roleId: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            textId: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            slot: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            bank: {
                type: DataTypes.FLOAT,
                allowNull: true
            },
            boost: {
                type: DataTypes.FLOAT,
                allowNull: true
            },
            trophies: {
                type: DataTypes.JSON
            }
        }, {
            timestamps: false,
            tableName: 'teams',
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci'
        })
        return database.models.teams;
    } catch (e) {}
}