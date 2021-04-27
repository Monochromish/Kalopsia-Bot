const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'volume',
    description: "Changes Volume",
    usage: "[prefix]volume [number from 1 - 100]",
    aliases: ['vol'],
    run: async(client, message, args) => {
        if (!message.member.voice.channel) {
            const volumeError = new MessageEmbed()
              .setDescription("Please join a VC")
              .setColor("RANDOM")
            return message.channel.send(volumeError)
        }
        if(!client.distube.isPlaying(message)) {
            const volumeError2 = new MessageEmbed()
            .setDescription("Please play a song")
            .setColor("RANDOM")
            return message.channel.send(volumeError2)
        }
        let volume = parseInt(args[0])
        if(isNaN(args[0])) {
            const volumeError3 = new MessageEmbed()
            .setDescription('Please Enter a Valid Number Between 1 - 100')
            .setColor("RANDOM")
            return message.channel.send(volumeError3)
        }
        if(args[0] > 100) {
            const volumeError4 = new MessageEmbed()
            .setDescription('Please Enter a Valid Number Between 1 - 100')
            .setColor("RANDOM")
            return message.channel.send(volumeError4)
        }

        client.distube.setVolume(message, volume)
        const embed = new MessageEmbed()
        .setDescription(`Volume has been set to \`${volume}%\``)
        .setColor("RANDOM")
        message.channel.send(embed)

    }
}