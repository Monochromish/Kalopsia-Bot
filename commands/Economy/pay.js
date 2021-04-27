const { MessageEmbed } = require('discord.js')
const db = require('quick.db');

module.exports = {
    name: 'pay',
    description: "Pay",
    usage: "[prefix]pay [amount] <mention>",
    aliases: ['share'],
    run: async(client, message, args) => {

        let user = message.mentions.users.first()
        let amount = args[0]
        let author = message.author;

        if(!user) {
            const payError = new MessageEmbed()
            .setDescription("You Need to Mention a User to give money to")
            .setColor("BLUE")

            return message.channel.send(payError)
        }
        if(isNaN(args[0])) {
            const payError2 = new MessageEmbed()
            .setDescription("That is Not a Valid Amount")
            .setColor("BLUE")

            return message.channel.send(payError2)
        }
        if(user.id === author.id) {
            const payError3 = new MessageEmbed()
            .setDescription("You Cannot Pay Yourself")
            .setColor("BLUE")
            
            return message.channel.send(payError3)
        }

        if(args[0] < 0) {
            const payError4 = new MessageEmbed()
            .setDescription("You Need to give more than \$0")
            .setColor("BLUE")

            return message.channel.send(payError4)
        }

        let PayerAmount = db.fetch(`money_${message.guild.id}_${author.id}`)

        if(args[0] > PayerAmount) {
            const payError5 = new MessageEmbed()
            .setDescription("You Don\'t Have Enough Money to Send!")
            .setColor("BLUE")

            return message.channel.send(payError5)
        }


        db.subtract(`money_${message.guild.id}_${author.id}`, args[0])
        db.add(`money_${message.guild.id}_${user.id}` , args[0])

        const paySuccess = new MessageEmbed()
        .setDescription(`Successfully Payed \$${args[0]} to ${user}`)
        .setColor("BLUE")

        message.channel.send(paySuccess)

    }
}