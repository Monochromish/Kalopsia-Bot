const { MessageEmbed } = require("discord.js");
const db = require('quick.db');

module.exports = {
    name: 'balance',
    description: "Shows your / someone elses balance in this guild",
    usage: "[prefix]balance",
    aliases: ['bal'],
    run: async(client, message, args) => {

        let user  = message.mentions.users.first() || message.author

        let bal = await db.fetch(`money_${message.guild.id}_${user.id}`)
        let bankBalance = await db.fetch(`bank_${message.guild.id}_${user.id}`)

        if(bal === null) bal = 0;
        if(bankBalance === null) bankBalance = 0;

        const balEmbed = new MessageEmbed()
        .setTitle(`:bank: ${user.username}\'s Balance`)
        .setColor("RANDOM")
        .addField('Balance', `You Currently have \$${bal} in Cash`)
        .addField('Bank Balance', `You Currently have \$${bankBalance} in your Bank Account`)

        message.channel.send(balEmbed)
    }
}