exports.PrinterManager = class PrinterManager {
    constructor(values = {}) {
        this.guildId = values.guildId;
        this.userId = values.userId;
        this.printerLimitInk = !values.printerLimitInk ? 20 : values.printerLimitInk;
        this.printerLimitPaper = !values.printerLimitPaper ? 20 : values.printerLimitPaper;
        this.printerLimitBattery = !values.printerLimitBattery ? 100 : values.printerLimitBattery;
        this.printerInk = !values.printerInk ? 20 : values.printerInk;
        this.printerPaper = !values.printerPaper ? 20 : values.printerPaper;
        this.printerBattery = !values.printerBattery ? 100 : values.printerBattery;
        this.printerStatus = !values.printerStatus;
        this.printerBank = !values.printerBank ? 0 : values.printerBank;
    }

    pushData(RosaCoins) {
        return RosaCoins.functions.updateOrCreate(RosaCoins.database.models.printers, {
            guildId: this.guildId,
            userId: this.userId
        }, {
            guildId: this.guildId,
            userId: this.userId,
            printerLimitInk: this.printerLimitInk,
            printerLimitPaper: this.printerLimitPaper,
            printerLimitBattery: this.printerLimitBattery,
            printerInk: this.printerInk,
            printerPaper: this.printerPaper,
            printerBattery: this.printerBattery,
            printerStatus: this.printerStatus,
            printerBank: this.printerBank,
        });
    }
}