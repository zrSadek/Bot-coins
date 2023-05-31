exports.MineZoneManager = class MineZoneManager {
    constructor(values = {}) {
        this.guildId = values.guildId;
        this.userId = values.userId;
        this.inventory = !values.inventory ? {"inventory": []} : values.inventory;
        this.slotInventory = !values.slotInventory ? 20 : values.slotInventory;
    }

    pushData(RosaCoins) {
        return RosaCoins.functions.updateOrCreate(RosaCoins.database.models.minezone, {
            guildId: this.guildId,
            userId: this.userId
        }, {
            guildId: this.guildId,
            userId: this.userId,
            inventory: this.inventory,
            slotInventory: this.slotInventory
        });
    }
}