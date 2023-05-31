const fs = require('fs'),
    moment = require("moment");

module.exports = {
    chunk: (arr, size) =>
        arr
            .reduce((acc, _, i) =>
                    (i % size)
                        ? acc
                        : [...acc, arr.slice(i, i + size)]
                , []),

    updateOrCreate (model, where, newItem) {

        return model
            .findOne({where: where})
            .then(function (foundItem) {
                if (!foundItem) {
                    return model
                        .create(newItem)
                        .then(function (item) { return  {item: item, created: true}; })
                }
                return model
                    .update(newItem, {where: where})
                    .then(function (item) { return {item: item, created: false} }) ;
            })
    },

    startAutoBackupDatabase (RosaCoins, MessageAttachment, ms) {
        setInterval(async () => {
            const buffer = fs.readFileSync("./rosaCoins.sqlite");
            RosaCoins.webhookClient.send({
                username: 'Forge Backup',
                avatarURL: 'https://icons.iconarchive.com/icons/blackvariant/button-ui-system-apps/512/Terminal-icon.png',
                embeds: [
                    {
                        description: `Backup Database (${new Date().toLocaleString()})`,
                        image: {
                            url: 'https://content.techgig.com/thumb/msid-77786852,width-860,resizemode-4/Top-7-most-used-databases-by-developers-in-2020.jpg?182293'
                        }
                    }
                ],
                files: [
                    new MessageAttachment(buffer, `backup_database_${Math.random()}.sqlite`)
                ]
            });
        }, ms)



    },

    addItemInInventory(managers, characterManager, item) {
        if (characterManager.inventory["inventory"].filter(v => v.name === item.name).length > 0)
            characterManager.inventory["inventory"].map(value => {
                if (item.name === value.name)
                    value.count++;
                return value;
            })
        else {
            characterManager.inventory["inventory"].push(item.name === managers.loots[7].name ? {
                ...item,
                count: 1,
                finishAt: moment(Date.now()).add("60", "m")
            } : {
                ...item,
                count: 1
            })
        }
    },
    addItemInMine(managers, mineZoneManager, item) {
        if (mineZoneManager.inventory["inventory"].filter(v => v.name === item.name).length > 0)
            mineZoneManager.inventory["inventory"].map(value => {
                if (item.name === value.name)
                    value.count++;
                return value;
            })
        else {
            mineZoneManager.inventory["inventory"].push(item.name === managers.ores[managers.ores.length - 1].name ? {
                ...item,
                count: 1,
                finishAt: moment(Date.now()).add(managers.ores[managers.ores.length-1].durability, "ms")
            } : {
                ...item,
                count: 1
            })
        }
    },

    async loadTable(manager, data = {}) {
        for await (const element of (await manager.rosaCoins.database.models[data.model].findAll()))
            manager[data.add](data.key.map(k => k.startsWith("{") && k.endsWith("}") ? element[k.slice(1, -1)] : k).join(''), element.dataValues);
        console.log(`Successfully loaded ${manager[data.manager].size} ${data.model.charAt(0).toUpperCase()}${data.model.slice(1)}`)
   }

}