const { MessageEmbed, MessageManager } = require("discord.js")

module.exports = {
    name: 'pause',
    description: "Pause Music",
    usage: "[prefix]pause",
    aliases: [],
    run: async(client, message, args) => {
        if (!message.member.voice.channel) {
            const pauseError = new MessageEmbed()
              .setDescription("Please join a VC")
              .setColor("RANDOM")
            return message.channel.send(pauseError)
        }
        if(!client.distube.isPlaying(message)) {
            const pauseError2 = new MessageEmbed()
            .setDescription("There is Nothing Playing")
            .setColor("RANDOM")
            return message.channel.send(pauseError2)
        }
        if(client.distube.isPaused(message)) {
            const pauseError3 = new MessageEmbed()
            .setDescription('The song is already paused')
            .setColor("RANDOM")
            return message.channel.send(pauseError3)
        }

        client.distube.pause(message)
        const embed = new MessageEmbed()
        .setDescription('Song has been paused')
        .setColor("RANDOM")
        message.channel.send(embed)
    }
}