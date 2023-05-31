exports.StateManager = class StateManager {
    constructor(values = {}) {
        this.guildId = "1097156536465379409";
        this.userId = values.userId;
        this.managers = values.managers;

        this.selfMute = values.newState.selfMute;
        this.selfDeaf = values.newState.selfDeaf;

        this.streaming = values.newState.streaming;
        this.selfVideo = values.newState.selfVideo;
        this.boosting = !!values.newState.member.premiumSince;

        this.guildManager = this.managers.guildManager.has(this.guildId) ? this.managers.guildManager.get(this.guildId) : this.managers.addGuild(this.guildId, {
            guildId: this.guildId
        });

        this.userManager = this.managers.userManager.has(values.keyMember) ? this.managers.userManager.get(values.keyMember) : this.managers.addUser(values.keyMember, {
            guildId: this.guildId,
            userId: this.userId
        })

        this.characterManager = this.managers.characterManager.has(values.keyMember) ? this.managers.characterManager.get(values.keyMember) : this.managers.addCharacter(values.keyMember, {
            guildId: this.guildId,
            userId: this.userId
        })

        this.teamManager = this.userManager.teamName ? this.managers.teamManager.get(`${this.guildId}-${this.userManager.teamName}`) : null;
    }

}