const db = require('quick.db');
const ms = require("parse-ms");
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'work',
    description: "Work",
    usage: "[prefix]work",
    run: async(client, message, args) => {

        let user = message.author;
        let author = await db.fetch(`worked_${message.guild.id}_${user.id}`)
        let timeout = 43200000

        if(author !== null && timeout - (Date.now() - author) > 0) {
            let time = ms(timeout - (Date.now() - author));
            const workEmbed = new MessageEmbed()
            .setDescription(`You are Tired \n You Cannot work for another ${time.hours}h , ${time.minutes}m and ${time.seconds}s`)
            .setColor("RANDOM")

            return message.channel.send(workEmbed)
        } else {
            let amount = Math.floor(Math.random() * 25) + 1
            db.add(`money_${message.guild.id}_${user.id}`, amount)
            db.set(`worked_${message.guild.id}_${user.id}`, Date.now())

            const workSuccess = new MessageEmbed()
            .setDescription(`${user}, You worked and earned \$${amount}`)
            .setColor("RANDOM")

            message.channel.send(workSuccess)
        }
    }
}