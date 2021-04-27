const db = require('quick.db');
const ms = require('parse-ms');
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'rob',
    description: "Rob someone [You need Gun from Store]",
    usage: "?rob <mention>",
    run: async(client, message, args) => {
        let timeout = 7200000;
        let user = message.mentions.users.first()
        let cash = db.fetch(`money_${message.guild.id}_${message.author.id}`)

        let robbedCash = db.fetch(`robbedCash_${message.guild.id}_${message.author.id}`)

        if(!db.has(`items_${message.guild.id}_${message.author.id}`, 'gun')) {
            const embed = new MessageEmbed()
            .setDescription("You Don\'t Have a Gun, Make sure you buy one from the Store!")
            .setColor("RANDOM")

            return message.channel.send(embed)
        }

        if(!user) {
            const robError = new MessageEmbed()
            .setDescription("You Need to Mention someone to Rob them!")
            .setColor("RANDOM")

            return message.channel.send(robError)
        }
        if(message.author === user) {
            const embed2 = new MessageEmbed()
            .setDescription("You Can Not Rob Yourself")
            .setColor("RANDOM")

            return message.channel.send(embed2)
        }

        
        let memberCash = db.fetch(`money_${message.guild.id}_${user.id}`)

        if(memberCash == null || 0) {
            robErr = new MessageEmbed()
            .setDescription(`Sadly, ${user} does not have any cash on them! \n Try again later!`)
            .setColor("RANDOM")

            db.set(`robbedCash_${message.guild.id}_${message.author.id}`, Date.now())
            return message.channel.send(robErr)
            
            
        }
        if(cash > memberCash) {
            const robError2 = new MessageEmbed()
            .setDescription("You Can Only Rob Someone with More Cash than you!")
            .setColor("RANDOM")

            return message.channel.send(robError2)
        }

        if(robbedCash !== null && timeout - (Date.now() - robbedCash) > 0) {
            let time = ms(timeout - (Date.now() - robbedCash))

            const robEmbed = new MessageEmbed()
            .setDescription(`You Cannot rob someone for another ${time.hours}h , ${time.minutes}m and ${time.seconds}s`)
            .setColor("RANDOM")

            return message.channel.send(robEmbed)
        }

        let amount = Math.floor(Math.random() * memberCash) + 1
        db.subtract(`money_${message.guild.id}_${user.id}`, amount)
        db.delete(`items_${message.guild.id}_${message.author.id}`, 'Thief Outfit')
        db.add(`money_${message.guild.id}_${message.author.id}`, amount)
        db.set(`robbedCash_${message.guild.id}_${message.author.id}`, Date.now())

        const robSuccess = new MessageEmbed()
        .setDescription(`Successfully Robbed \$${amount} from ${user}`)
        .setColor("RANDOM")

        message.channel.send(robSuccess)


    }
}