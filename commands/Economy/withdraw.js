const db = require('quick.db');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'withdraw',
    description: "Withdraw Money from Your Bank Account",
    usage: "[prefix]withdraw <amount>",
    run: async (client, message, args) => {
        let member = message.author;
        let bankBalance = db.fetch(`bank_${message.guild.id}_${member.id}`)

        if (!args[0]) {
            const withdrawError = new MessageEmbed()
                .setDescription("Please specify a valid amount to withdraw from your bank")
                .setColor("RANDOM")

            return message.channel.send(withdrawError)
        }
        if (isNaN(args[0])) {
            const withdrawError2 = new MessageEmbed()
                .setDescription("Please specify a **valid amount** to withdraw from your bank")
                .setColor("RANDOM")

            return message.channel.send(withdrawError2)
        }
        if(args[0] > bankBalance) {
            const withdrawError3 = new MessageEmbed()
                .setDescription("You do not have that much money in your bank")
                .setColor("RANDOM")

            return message.channel.send(withdrawError3)
        }
        if(args[0] > 250) {
            const withdrawError4 = new MessageEmbed()
                .setDescription("You can only withdraw \$250 at once.")
                .setColor("RANDOM")

            return message.channel.send(withdrawError4)
        }

        
        db.subtract(`bank_${message.guild.id}_${member.id}`, args[0])
        db.add(`money_${message.guild.id}_${member.id}`, args[0])
        let cashBalance = db.fetch(`money_${message.guild.id}_${member.id}`)

        const withdrawSuccess = new MessageEmbed()
        .setDescription(`Successfully withdrawn \$${args[0]} from your Bank Balance. \n Current Cash Balance : \$${cashBalance}`)
        .setColor("RANDOM")

        message.channel.send(withdrawSuccess)

    }
}