const { MessageEmbed } = require('discord.js');
const db = require('quick.db');
const ms = require('parse-ms');

module.exports = {
    name: 'deposit',
    description: "Deposit Money",
    usage: "[prefix]deposit <amount>",
    aliases: ['dep'],
    run: async (client, message, args) => {
        
        let member = message.author;


        let all = db.fetch(`money_${message.guild.id}_${member.id}`)

        if(args[0] === "all") args[0] = all


        if (!args[0]) {
            const depositError = new MessageEmbed()
                .setTitle("You Need to Give a Valid Amount to Deposit")
                .setColor("RANDOM")
                .setFooter("You can do \"?deposit all\" to deposit all your cash at once")

            return message.channel.send(depositError)
        }

        if (isNaN(args[0])) {
            const depositError2 = new MessageEmbed()
                .setDescription("That is not a Valid amount!")
                .setColor("RANDOM")

            return message.channel.send(depositError2)
        }

        if (args[0] > all) {
            const depositError3 = new MessageEmbed()
                .setDescription("You Do Not Have That Much Cash!")
                .setColor("RANDOM")

            return message.channel.send(depositError3)
        }


        


        
        db.subtract(`money_${message.guild.id}_${member.id}`, args[0])
        db.add(`bank_${message.guild.id}_${member.id}`, args[0])
        let bankBal = db.fetch(`bank_${message.guild.id}_${message.author.id}`)

        let depositSuccess = new MessageEmbed()
            .setDescription(`Successfully Deposited \$${args[0]} to Your Bank Account! \n Your New Bank Balance is \$${bankBal}`)
            .setColor("RANDOM")

        message.channel.send(depositSuccess)






    }
}