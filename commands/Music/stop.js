const { MessageEmbed } = require("discord.js")

module.exports = {
    name: 'stop',
    description: "Stops the Music and clears queue",
    usage: "[prefix]stop",
    aliases: [],
    run: async(client, message, args) => {
        if (!message.member.voice.channel) {
            const stopError = new MessageEmbed()
              .setDescription("Please join a VC")
              .setColor("RANDOM")
            return message.channel.send(stopError)
        }
        if(!client.distube.isPlaying(message)) {
            const stopError2 = new MessageEmbed()
            .setDescription("Please play a song")
            .setColor("RANDOM")
            return message.channel.send(stopError2)
        }
        client.distube.stop(message);
        const embed = new MessageEmbed()
        .setDescription('Song has been stopped')
        .setColor("RANDOM")
        message.channel.send(embed)

    }
}