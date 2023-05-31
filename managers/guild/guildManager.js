exports.GuildManager = class GuildManager {
    constructor(values = {}) {
        this.guildId = values.guildId;
        this.wl = !values.wl ? {"wl": []} : values.wl;
        this.shopRoles = !values.shopRoles ? {"shopRoles": []} : values.shopRoles;

        this.channelVoiceTeam = !values.channelVoiceTeam ? null : values.channelVoiceTeam;
        this.categoryTextTeam = !values.categoryTextTeam ? null : values.categoryTextTeam;
        this.channelLogs = !values.channelLogs ? null : values.channelLogs;
        this.channelLogsEnchere = !values.channelLogsEnchere ? null : values.channelLogsEnchere;

        this.lootMobChannel = !values.lootMobChannel ? null : values.lootMobChannel;
        this.lootMobRole = !values.lootMobRole ? null : values.lootMobRole;
        this.bleachingChannel = !values.bleachingChannel ? null : values.bleachingChannel;

        this.mineZoneChannel = !values.mineZoneChannel ? null : values.mineZoneChannel;
        this.mineZoneRole = !values.mineZoneRole ? null : values.mineZoneRole;
        this.foundryChannel = !values.foundryChannel ? null : values.foundryChannel;

        this.globalBoost = !values.globalBoost ? 0 : values.globalBoost;
    }

    pushData(RosaCoins) {
        return RosaCoins.functions.updateOrCreate(RosaCoins.database.models.guilds, {
            guildId: this.guildId
        }, {
            guildId: this.guildId,
            wl: this.wl,
            shopRoles: this.shopRoles,
            channelVoiceTeam: this.channelVoiceTeam,
            categoryTextTeam: this.categoryTextTeam,
            channelLogs: this.channelLogs,
            channelLogsEnchere: this.channelLogsEnchere,

            lootMobChannel: this.lootMobChannel,
            lootMobRole: this.lootMobRole,
            bleachingChannel: this.bleachingChannel,

            mineZoneChannel: this.mineZoneChannel,
            mineZoneRole: this.mineZoneRole,
            foundryChannel: this.foundryChannel,

            globalBoost: this.globalBoost
        });
    }
}