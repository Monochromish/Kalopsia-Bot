const { MessageEmbed } = require("discord.js");
const db = require('quick.db');

module.exports = {
    name: 'buy',
    description: "Buy Items from the Shop",
    aliases: [],
    usage: "[prefix]buy [item]",
    run: async(client, message, args) => {
        let purchase = args.join(" ")
        let cash = await db.fetch(`money_${message.guild.id}_${message.author.id}`)

        if(!purchase) {
            const buyError = new MessageEmbed()
            .setDescription("Please specify an item")
            .setColor("RANDOM")

            return message.channel.send(buyError)
        }
        let items = await db.fetch(`items_${message.guild.id}_${message.author.id}`, {items: []})

        if(purchase == 'gun') {
            if(cash < 10000) {
                const purchaseError = new MessageEmbed()
                .setDescription("You Don\'t Have Enough Money to Buy a Gun!")
                .setColor("RANDOM")

                return message.channel.send(purchaseError)
            }

            db.subtract(`money_${message.guild.id}_${message.author.id}`, 10000)
            db.push(`items_${message.guild.id}_${message.author.id}`, "gun")

            const purchaseThiefOutfitSuccess = new MessageEmbed()
            .setDescription(`Successfuly Bought One Gun for \$10000 , Damn mans got a gun`)
            .setColor("RANDOM")

            message.channel.send(purchaseThiefOutfitSuccess)
        }
            message.channel.send(purchaseCarSuccess)
        }
    }