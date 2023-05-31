const
    {Collection} = require('discord.js'),
    {GuildManager} = require('./guild/guildManager'),
    {TeamManager} = require('./team/TeamManager'),
    {UserManager} = require('./user/UserManager'),
    {PrinterManager} = require('./user/PrinterManager'),
    {StateManager} = require('./voice/StateManager'),
    {CharacterManager} = require('./user/CharacterManager'),
    {MineZoneManager} = require('./user/MineZoneManager'),
    moment = require('moment');


exports.Managers = class Managers {
    constructor(RosaCoins) {
        this.rosaCoins = RosaCoins;

        this.btcPrice = null;

        const price = require('crypto-price');
        setInterval(() => {
            price.getBasePrice("BTC", "EUR").then(obj => {
                this.btcPrice = parseFloat(obj.price)
            }).catch(err => {
                //console.log(err)
            })
        }, 2500);

        this.guildManager = new Collection();
        this.teamManager = new Collection();

        this.userManager = new Collection();
        this.printerManager = new Collection();

        this.characterManager = new Collection();

        this.mineZoneManager = new Collection();

        this.membersInVoice = new Collection();

        this.ores = [
            {
                name: "iron_ore",
                emoji: "<:iron_ore:1100580561254367292>",
                coalRequire: 1,
                percentage: 0.23,
                result: {
                    name: "iron_ingot",
                    emoji: "<:iron_ingot:1100580560159637574>",
                    price: 50
                }
            },
            {
                name: "gold_ore",
                emoji: "<:gold_ore:1100580563380863067>",
                coalRequire: 1,
                percentage: 0.20,
                result: {
                    name: "gold_ingot",
                    emoji: "<:gold_ingot:1100580565201211483>",
                    price: 60
                }
            },
            {
                name: "diamond_ore",
                emoji: "<:diamond_ore:1100580567147348088>",
                coalRequire: 2,
                percentage: 0.15,
                result: {
                    name: "diamond_ingot",
                    emoji: "<:diamond_ingot:1100580568661495909>",
                    price: 70
                }
            },
            {
                name: "emerald_ore",
                emoji: "<:emerald_ore:1100582997775884339>",
                coalRequire: 0,
                timeRequire: 1000*30,
                percentage: 0.05,
                result: {
                    name: "emerald_ingot",
                    emoji: "<:emerald_ingot:1100582999101276261>",
                    price: 90
                }
            },

            //TODO: COAL
            {
                name: "coal",
                emoji: "<:show:1100498291914973238>",
                price: 5
            },

            //TODO: WOOD PICKAXE
            {
                name: "wood_pickaxe",
                emoji: "<:erghrehgreh:1100499486775713802>",
                durability: (1000*60) * 30,
                price: 1500
            }
        ]

        this.loots = [
            {
                name: "enderPearl",
                emoji: "<:enderpearl:817988779582291988>",
                price: 60
            },
            {
                name: "os",
                emoji: "<:osmc:817988951973036074>",
                price: 40
            },
            {
                name: "chair",
                emoji: "<:chairmc:817989108328562689>",
                price: 40
            },
            {
                name: "steak",
                emoji: "🍗",
                price: 50,
                saturation: 10
            },
            {
                name: "pizza",
                emoji: "🍕",
                price: 125,
                saturation: 25
            },
            {
                name: "sword",
                emoji: "🔪",
                price: 10000
            },
            {
                name: "shield",
                emoji: "🛡️",
                price: 15000
            },
            {
                name: "parchemin",
                emoji: "📜",
                price: 2500
            }
        ];
    }

    //TODO: GENERAL MANAGERS
    addGuild(key, value = {}) {
        this.guildManager.set(key, new GuildManager(value));
        return this.guildManager.get(key);
    }
    addTeam(key, value) {
        return this.teamManager.set(key, new TeamManager(value));
    }
    addUser(key, value) {
        this.userManager.set(key, new UserManager(value));
        return this.userManager.get(key);
    }
    addPrinter(key, value) {
        return this.printerManager.set(key, new PrinterManager(value));
    }

    addCharacter(key, value) {
        this.characterManager.set(key, new CharacterManager(value));
        return this.characterManager.get(key);
    }

    addMineZone(key, value) {
        this.mineZoneManager.set(key, new MineZoneManager(value));
        return this.mineZoneManager.get(key);
    }

    addMemberInVoice(key, value) {
        return this.membersInVoice.set(key, new StateManager(value));
    }

    getDataUser(message, data = {}) {
        const keyMember = `${message.guild.id}-${data.userId ? data.userId : message.author.id}`;
        return {
            guildManager: this.guildManager.has(message.guild.id) ? this.guildManager.get(message.guild.id) : null,
            userManager: this.userManager.has(keyMember) ? this.userManager.get(keyMember) : this.addUser(keyMember, {
                guildId: message.guild.id,
                userId: data.userId ? data.userId : message.author.id
            }),
            printerManager: this.printerManager.has(keyMember) ? this.printerManager.get(keyMember) : null,
            characterManager: this.characterManager.has(keyMember) ? this.characterManager.get(keyMember) : this.addCharacter(keyMember, {
                guildId: message.guild.id,
                userId: data.userId ? data.userId : message.author.id
            }),
            mineZoneManager: this.mineZoneManager.has(keyMember) ? this.mineZoneManager.get(keyMember) : this.addMineZone(keyMember, {
                guildId: message.guild.id,
                userId: data.userId ? data.userId : message.author.id
            })
        }
    }

    getDataUserWithGuildAndUser(guild, user, data = {}) {
        const keyMember = `${guild.id}-${data.userId ? data.userId : user.id}`;
        const userManager = this.userManager.has(keyMember) ? this.userManager.get(keyMember) : this.addUser(keyMember, {
            guildId: guild.id,
            userId: data.userId ? data.userId : user.id
        })
        return {
            guildManager: this.guildManager.has(guild.id) ? this.guildManager.get(guild.id) : null,
            userManager,
            teamManager: userManager && userManager.teamName && this.teamManager.has(`${userManager.guildId}-${userManager.teamName}`) ? this.teamManager.get(`${userManager.guildId}-${userManager.teamName}`) : null,
            printerManager: this.printerManager.has(keyMember) ? this.printerManager.get(keyMember) : null,
            characterManager: this.characterManager.has(keyMember) ? this.characterManager.get(keyMember) : this.addCharacter(keyMember, {
                guildId: guild.id,
                userId: data.userId ? data.userId : user.id
            }),
            mineZoneManager: this.mineZoneManager.has(keyMember) ? this.mineZoneManager.get(keyMember) : this.addMineZone(keyMember, {
                guildId: guild.id,
                userId: data.userId ? data.userId : user.id
            })
        }
    }

    getDataTeam(message, data = {}) {
        if (!data.teamName) return null;
        const keyTeam = `${message.guild.id}-${data.teamName}`;
        return {
            guildManager: this.guildManager.has(message.guild.id) ? this.guildManager.get(message.guild.id) : null,
            teamManager: this.teamManager.has(keyTeam) ? this.teamManager.get(keyTeam) : null
        }
    }

    async autoPushToDatabase(ms) {
        setInterval(async () => {
            console.log("\n================================================")
            for await (const guildManager of this.guildManager)
                try {
                    await guildManager[1].pushData(this.rosaCoins);
                } catch (e) {}
            console.log(`Successfully pushed ${this.guildManager.size} Guilds data to the database.`)
            for await (const teamManager of this.teamManager)
                try {
                    await teamManager[1].pushData(this.rosaCoins);
                } catch (e) {}
            console.log(`Successfully pushed ${this.teamManager.size} Teams data to the database.`)
            for await (const userManager of this.userManager)
                try {
                    await userManager[1].pushData(this.rosaCoins);
                } catch (e) {}
            console.log(`Successfully pushed ${this.userManager.size} Users data to the database.`)
            for await (const printerManager of this.printerManager)
                try {
                    await printerManager[1].pushData(this.rosaCoins);
                } catch (e) {}
            console.log(`Successfully pushed ${this.printerManager.size} Printers data to the database.`)
            for await (const characterManager of this.characterManager)
                try {
                    await characterManager[1].pushData(this.rosaCoins);
                } catch (e) {}
            console.log(`Successfully pushed ${this.characterManager.size} Characters data to the database.`)
            for await (const mineZoneManager of this.mineZoneManager)
                try {
                    await mineZoneManager[1].pushData(this.rosaCoins);
                } catch (e) {}
            console.log(`Successfully pushed ${this.mineZoneManager.size} MineZones data to the database.`)
            console.log("================================================\n")
        }, 10000);
    }

    async loadDatabase() {
        console.log("\n================================================")
        await this.rosaCoins.functions.loadTable(this, {
            model: 'guilds',
            key: ['{guildId}'],
            add: 'addGuild',
            manager: "guildManager"
        })
        await this.rosaCoins.functions.loadTable(this, {
            model: 'teams',
            key: ['{guildId}', '-', '{teamName}'],
            add: 'addTeam',
            manager: "teamManager"
        })
        await this.rosaCoins.functions.loadTable(this, {
            model: 'users',
            key: ['{guildId}', '-', '{userId}'],
            add: 'addUser',
            manager: "userManager"
        })
        await this.rosaCoins.functions.loadTable(this, {
            model: 'printers',
            key: ['{guildId}', '-', '{userId}'],
            add: 'addPrinter',
            manager: "printerManager"
        })
        await this.rosaCoins.functions.loadTable(this, {
            model: 'characters',
            key: ['{guildId}', '-', '{userId}'],
            add: 'addCharacter',
            manager: "characterManager"
        })
        await this.rosaCoins.functions.loadTable(this, {
            model: 'minezone',
            key: ['{guildId}', '-', '{userId}'],
            add: 'addMineZone',
            manager: "mineZoneManager"
        })
        //console.log("================================================\n")
    }
    async loadVoice() {
        for await (const guildManager of this.guildManager) {
            if (!this.rosaCoins.open || this.rosaCoins.lock) return;
            const guild = this.rosaCoins.guilds.resolve(guildManager[0]);
            if (!guild) return;
            guild.channels.cache.filter(channel => channel.type === "voice").map(voiceChannel => voiceChannel.members).forEach(members => members.forEach(member => {
                this.addMemberInVoice(`${guild.id}-${member.id}`, {
                    guildId: guild.id,
                    userId: member.id,
                    keyMember: `${guild.id}-${member.id}`,
                    managers: this,
                    newState: member.voice
                })
            }))
            //console.log(`Successfully added ${this.membersInVoice.size} VoiceStates to the data.`)
        }
    }
    async autoSaveVoice(ms) {
        setInterval(async () => {
            if (!this.rosaCoins.open || this.rosaCoins.lock) return;
            for await (const membersInVoice of this.membersInVoice) {
                let randomCoins = Math.random() * (0.45 - 0.535) + 0.535;
                const boostVoice = ((membersInVoice[1].streaming || membersInVoice[1].selfVideo) && (!membersInVoice[1].selfMute && !membersInVoice[1].selfDeaf)) ? 1.7 : (membersInVoice[1].selfMute || membersInVoice[1].selfDeaf ? 0.01 : 1);
                let boost = membersInVoice[1].teamManager ? (parseFloat(membersInVoice[1].teamManager.boost) + boostVoice) : boostVoice;
                boost += membersInVoice[1].guildManager ? (membersInVoice[1].guildManager.globalBoost ? parseFloat(membersInVoice[1].guildManager.globalBoost) : 0) : 0;
                boost += membersInVoice[1].boosting ? 0.4 : 0;
                boost = Math.round((boost + Number.EPSILON) * 100) / 100;
                membersInVoice[1].userManager.coins += (randomCoins*boost);
            }
            //console.log(`Successfully updated ${this.membersInVoice.size} VoiceStates to the data.`)
        }, ms);

        setInterval(async () => {

            if (!this.rosaCoins.open || this.rosaCoins.lock) return;
            this.guildManager.filter(g => this.rosaCoins.guilds.cache.has(g.guildId)).forEach(guild => {
                //TODO: Blanching channel
                const bChannel = this.rosaCoins.channels.cache.get(guild.bleachingChannel);
                if (bChannel) {
                    bChannel.members.forEach(m => {
                        if (!this.userManager.has(`${bChannel.guild.id}-${m.id}`)) return;
                        const userManager = this.userManager.get(`${bChannel.guild.id}-${m.id}`);
                        if (userManager.dirtyCoins < 1) return;
                        userManager.dirtyCoins -= parseFloat(userManager.dirtyCoins < 100.0 ? userManager.dirtyCoins : 100.0);
                        userManager.coins += parseFloat(userManager.dirtyCoins < 100.0 ? userManager.dirtyCoins : 100.0);
                        if (userManager.dirtyCoins < 0.0)
                            userManager.dirtyCoins = 0.0;
                    })
                }

                const mineChannel = this.rosaCoins.channels.cache.get(guild.foundryChannel);
                if (mineChannel) {
                    mineChannel.members.forEach(m => {
                        if (!this.mineZoneManager.has(`${mineChannel.guild.id}-${m.id}`)) return;
                        if (!this.characterManager.has(`${mineChannel.guild.id}-${m.id}`)) return;
                        const characterManager = this.characterManager.get(`${mineChannel.guild.id}-${m.id}`);
                        const mineZoneManager = this.mineZoneManager.get(`${mineChannel.guild.id}-${m.id}`);
                        const ores = mineZoneManager.inventory["inventory"].filter(i => this.ores.slice(0, -2).map(v => v.name).includes(i.name)).sort((a, b) => a.coalRequire - b.coalRequire);
                        if (!ores || ores.length < 1) return;
                        const coal = mineZoneManager.inventory["inventory"].find(x => x.name === this.ores[this.ores.length - 2].name);
                        if (!coal) return;

                        const ore = ores[0];
                        if (coal.count < ore.coalRequire) return;

                        mineZoneManager.inventory["inventory"] = ore.count <= 1 ? mineZoneManager.inventory["inventory"].filter(x => x.name !== ore.name) : mineZoneManager.inventory["inventory"].map(x => {
                            if (x.name === ore.name)
                                x.count--;
                            return x;
                        });

                        mineZoneManager.inventory["inventory"] = coal.count <= ore.coalRequire ? mineZoneManager.inventory["inventory"].filter(x => x.name !== coal.name) : mineZoneManager.inventory["inventory"].map(x => {
                            if (x.name === coal.name)
                                x.count -= ore.coalRequire;
                            return x;
                        });
                        this.rosaCoins.functions.addItemInInventory(this, characterManager, ore.result);
                    })
                }
            })

            //TODO: MineZone
            this.mineZoneManager.filter(c => c.inventory["inventory"].find(x => x.name === this.ores[this.ores.length - 1].name)).forEach(mineZone => {
                const guild = this.rosaCoins.guilds.cache.get(mineZone.guildId);
                if (!guild) return;
                const guildManager = this.guildManager.get(guild.id);
                if (!guildManager) return;

                const member = guild.members.cache.get(mineZone.userId);
                if (!member) return;

                const role = guild.roles.cache.get(guildManager.mineZoneRole);
                const voice = guild.channels.cache.get(guildManager.mineZoneChannel);
                if (!role || !voice) return;
                const inventory = mineZone.inventory["inventory"],
                    pickaxe = inventory.find(x => x.name === this.ores[this.ores.length - 1].name);
                if (!pickaxe) return;

                //TODO: CONSUMED => REMOVE PICKAXE AND ROLE
                if (moment(pickaxe.finishAt).isBefore(Date.now())) {
                    member.roles.remove(role).catch(() => {});
                    mineZone.inventory["inventory"] = inventory.filter(ore => ore.name !== this.ores[this.ores.length - 1].name);
                    return;
                }

                //TODO: IF ROLE NOT IN MEMBER, ADD ROLE
                if (pickaxe && !member.roles.cache.has(role.id)) {
                    member.roles.add(role).catch(() => {})
                    return;
                }

                //TODO: GIVE ORE RANDOM WITH %
                if (member.voice.channel && member.voice.channel.id === voice.id) {
                    const slot = inventory.length < 1 ? 0 : inventory.map(v => v.count).reduce((prev, curr) => prev + curr);
                    if (slot >= mineZone.slotInventory) return;
                    const ores = this.ores.slice(0, -2);
                    ores.push(null);
                    const ore = randomizer(ores, ores.map(v => v && v.percentage ? v.percentage : "*"));
                    if (ore)
                        this.rosaCoins.functions.addItemInMine(this, mineZone, ore);
                }
            })

            //TODO: MobZone
            this.characterManager.filter(c => c.inventory["inventory"].find(x => x.name === this.loots[7].name)).forEach(character => {
                const guild = this.rosaCoins.guilds.cache.get(character.guildId);
                if (!guild) return;
                const guildManager = this.guildManager.get(guild.id);
                if (!guildManager) return;

                const member = guild.members.cache.get(character.userId);
                if (!member) return;

                const role = guild.roles.cache.get(guildManager.lootMobRole);
                const voice = guild.channels.cache.get(guildManager.lootMobChannel);
                if (!role || !voice) return;
                const inventory = character.inventory["inventory"],
                    parchemin = inventory.find(x => x.name === this.loots[7].name);
                if (!parchemin) return;

                //TODO: 1H CONSUMED => REMOVE PARCHEMIN AND ROLE
                if (moment(parchemin.finishAt).isBefore(Date.now()) || (parchemin.addedAt && moment(parchemin.addedAt).isBefore(Date.now()))) {
                    member.roles.remove(role).catch(() => {});
                    character.inventory["inventory"] = inventory.filter(loot => loot.name !== this.loots[7].name);
                    return;
                }

                //TODO: HEALTH < 1
                if (character.health < 0.1) return;

                //TODO: IF ROLE NOT IN MEMBER, ADD ROLE
                if (parchemin && !member.roles.cache.has(role.id)) {
                    member.roles.add(role).catch(() => {})
                    return;
                }


                //TODO: GIVE LOOT RANDOM WITH %
                if (member.voice.channel && member.voice.channel.id === voice.id) {
                    const slot = inventory.length < 1 ? 0 : inventory.map(v => v.count).reduce((prev, curr) => prev + curr);
                    if (slot >= character.slotInventory) return;
                    const boostSword = inventory.find(x => x.name === this.loots[5].name) ? 0.05 : 0;
                    const loot = randomizer([this.loots[0], this.loots[1], this.loots[2], null], [0.05+boostSword, 0.17, 0.17, "*"]);
                    if (loot)
                        this.rosaCoins.functions.addItemInInventory(this, character, loot);
                    let damage = 0.5;
                    damage -= inventory.find(x => x.name === this.loots[6].name) ? 0.2 : 0;
                    character.health = parseFloat((character.health-damage).toFixed(2));
                    if (character.health < 0.00)
                        character.health = 0.0;
                }
            })
        }, (1000*10))
    }


    autoPersonnage(ms) {
        setInterval(() => {
            if (!this.rosaCoins.open || this.rosaCoins.lock) return;
            this.characterManager.forEach(character => {
                const guild = this.rosaCoins.guilds.cache.get(character.guildId);
                if (!guild) return;
                if (!this.guildManager.has(guild.id)) return;
                const member = guild.members.cache.get(character.userId);
                if (!member || !member.voice.channel) return;
                if (character.food < 0.001) {
                    if (character.health > 0.00) {
                        character.health -= 2;
                        if (character.health < 0)
                            character.health = 0;
                    }
                } else {
                    character.food -= 0.2;
                    character.health += member.voice.channel.id === this.guildManager.get(guild.id).lootMobChannel ? 0.4 : 1.0;
                }
                character.food = character.food > 100.0 ? 100.0 : (character.food < 0.0 ? 0.0 : character.food);
                character.health = character.health > 100.0 ? 100.0 : (character.health < 0.0 ? 0.0 : character.health);
            })
        }, ms);
    }

    autoPrinter(ms) {
        setInterval(() => {
            if (!this.rosaCoins.open || this.rosaCoins.lock) return;

            const printerOnline = this.printerManager.filter(printerManager => printerManager.printerLimitInk && printerManager.printerInk > 0 && printerManager.printerPaper > 0 && printerManager.printerBattery > 0 && printerManager.printerStatus);
            const printerOffline = this.printerManager.filter(printerManager => printerManager.printerLimitInk && (printerManager.printerInk < 1 || printerManager.printerPaper < 1 || printerManager.printerBattery < 1));

            printerOffline.forEach(printerManager => printerManager.printerStatus = false);

            printerOnline.forEach(printerManager => {
                const guild = this.rosaCoins.guilds.resolve(printerManager.guildId);
                if (!guild) return;
                const member = guild.members.resolve(printerManager.userId);
                if (!member) return;
                printerManager.printerInk--;
                printerManager.printerPaper--;
                printerManager.printerBattery = printerManager.printerBattery - 3 < 0 ? 0 : printerManager.printerBattery - 3;
            })
        }, ms);

        setInterval(() => {
            if (!this.rosaCoins.open || this.rosaCoins.lock) return;

            const printerOnline = this.printerManager.filter(printerManager => printerManager.printerLimitInk && printerManager.printerInk > 0 && printerManager.printerPaper > 0 && printerManager.printerBattery > 0 && printerManager.printerStatus);

            printerOnline.forEach(printerManager => {
                const guild = this.rosaCoins.guilds.resolve(printerManager.guildId);
                if (!guild) return;
                const member = guild.members.resolve(printerManager.userId);
                if (!member) return;
                printerManager.printerBank += (0.7440476 * (member.voice.channel ? 1.4 : 1));
            });
            //console.log(`» ${0.7440476.toFixed(2)} Coins added to ${printerOnline.size} Members (PRINTERS)`)
        }, 2500);
    }
}

const randomizer = (values, probabilities) => {
    let i, pickedValue,
        randomNr = Math.random(),
        threshold = 0;

    for (i = 0; i < values.length; i++) {
        if (probabilities[i] === '*')
            continue;

        threshold += probabilities[i];
        if (threshold > randomNr) {
            pickedValue = values[i];
            break;
        }

        if (!pickedValue)
            pickedValue = values[probabilities.findIndex(p => p === "*")];
    }

    return pickedValue;
}