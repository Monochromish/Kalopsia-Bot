const { MessageEmbed } = require('discord.js');
const db = require('quick.db');

module.exports = {
    name: 'store',
    description: "Store",
    aliases: [],
    usage: "[prefix]store",
    run: async(client, message, args) => {

        const embed = new MessageEmbed()
        .setTitle('Store')
        .setColor("RANDOM")
        .addField('**gun**', "**Gives you ability to Rob other users, Buy This for \$10000** \n **Do `[prefix]buy gun` to Buy**")       

        message.channel.send(embed)
    }
}