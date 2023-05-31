exports.TeamManager = class TeamManager {
    constructor(values = {}) {
        this.guildId = values.guildId;
        this.teamName = values.teamName;
        this.ownerId = values.ownerId;
        this.adminIds = !values.adminIds ? {"admins": []} : values.adminIds;
        this.roleId = !values.roleId ? null : values.roleId;
        this.textId = !values.textId ? null : values.textId;
        this.slot = !values.slot ? 10 : values.slot;
        this.bank = !values.bank ? 0 : values.bank;
        this.boost = !values.boost ? 0 : values.boost;
        this.trophies = !values.trophies ? {"trophies": []} : values.trophies;
    }

    async destroy(RosaCoins) {
        await RosaCoins.database.models.teams.destroy({
            where: {
                guildId: this.guildId,
                teamName: this.teamName
            }
        })
        RosaCoins.managers.teamManager.delete(`${this.guildId}-${this.teamName}`);
    }

    pushData(RosaCoins) {
        return RosaCoins.functions.updateOrCreate(RosaCoins.database.models.teams, {
            guildId: this.guildId,
            teamName: this.teamName
        }, {
            guildId: this.guildId,
            teamName: this.teamName,
            ownerId: this.ownerId,
            adminIds: this.adminIds,
            roleId: this.roleId,
            textId: this.textId,
            slot: this.slot,
            bank: this.bank,
            boost: this.boost,
            trophies: this.trophies
        });
    }
}