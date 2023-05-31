const fs = require('fs');
exports.CharacterManager = class CharacterManager {
    constructor(values = {}) {
        const skins = fs.readFileSync("././utils/skins.txt", "utf8").split(/\r?\n/);
        this.guildId = values.guildId;
        this.userId = values.userId;
        this.avatar = !values.avatar ? skins[Math.floor(Math.random() * skins.length)] : values.avatar;
        this.health = !values.health ? 100 : values.health;
        this.food = !values.food ? 100 : values.food;
        this.xp = !values.xp ? 0 : values.xp;
        this.level = !values.level ? 1 : values.level;
        this.inventory = !values.inventory ? {"inventory": []} : values.inventory;
        this.slotInventory = !values.slotInventory ? 20 : values.slotInventory;
    }

    pushData(RosaCoins) {
        return RosaCoins.functions.updateOrCreate(RosaCoins.database.models.characters, {
            guildId: this.guildId,
            userId: this.userId
        }, {
            guildId: this.guildId,
            userId: this.userId,
            avatar: this.avatar,
            health: parseFloat(this["health"]),
            food: parseFloat(this["food"]),
            level: parseFloat(this["level"]),
            xp: parseFloat(this["xp"]),
            inventory: this.inventory,
            slotInventory: this.slotInventory
        });
    }
}