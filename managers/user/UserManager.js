exports.UserManager = class UserManager {
    constructor(values = {}) {
        this.guildId = values.guildId;
        this.userId = values.userId;
        this.coins = !values.coins ? 0 : values.coins;
        this.bitcoin = !values.bitcoin ? 0 : values.bitcoin;
        this.dirtyCoins = !values.dirtyCoins ? 0.0 : parseFloat(values.dirtyCoins);
        this.teamName = !values.teamName ? null : values.teamName;
        this.transactions = !values.transactions ? {"transactions": []} : values.transactions;
    }

    pushData(RosaCoins) {
        return RosaCoins.functions.updateOrCreate(RosaCoins.database.models.users, {
            guildId: this.guildId,
            userId: this.userId
        }, {
            guildId: this.guildId,
            userId: this.userId,
            coins: parseFloat(this["coins"]),
            bitcoin: parseFloat(this["bitcoin"]),
            dirtyCoins: parseFloat(this["dirtyCoins"]),
            teamName: this.teamName,
            transactions: this.transactions
        });
    }
}