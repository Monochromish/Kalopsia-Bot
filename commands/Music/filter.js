const { MessageEmbed } = require("discord.js")
const { setFilter } = require('distube')

module.exports = {
    name: 'filter',
    description: "Set Music Filter",
    usage: "[prefix]filter <filterOption>",
    aliases: ['setfilter', 'magic'],
    run: async (client, message, args) => {
        if (!message.member.voice.channel) {
            const filterError = new MessageEmbed()
                .setDescription("Please join a VC")
                .setColor("RANDOM")
            return message.channel.send(filterError)
        }
        if (!client.distube.isPlaying(message)) {
            const filterError2 = new MessageEmbed()
                .setDescription("There is Nothing Playing")
                .setColor("RANDOM")
            return message.channel.send(filterError2)
        }

        let filterOption = args[0];
        if (!args[0]) {
            const filterOptions = new MessageEmbed()
                .setTitle(`**Filter Options:**`)
                .setDescription(`\`3d, bassboost, echo, karaoke, nightcore, vaporwave\``)
                .setColor("RANDOM")

            return message.channel.send(filterOptions)
        }

        try {
            await client.distube.setFilter(message, filterOption)
                const embed = new MessageEmbed()
                    .setDescription('Music Filter is on : ' + `(${filterOption})` || 'Off')
                    .setColor("RANDOM")
    
                return message.channel.send(embed)
        } catch (error) {
            return;
        }



        }
}