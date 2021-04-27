const { MessageEmbed } = require("discord.js")

module.exports = {
    name: 'seek',
    description: "seeek",
    usage: "[prefix]seek <amount in seconds>",
    aliases: [],
    run: async(client, message, args) => {
        if (!message.member.voice.channel) {
            const seekError = new MessageEmbed()
              .setDescription("Please join a VC")
              .setColor("RANDOM")
            return message.channel.send(seekError)
        }
        if(!client.distube.isPlaying(message)) {
            const seekError2 = new MessageEmbed()
            .setDescription("Please play a song")
            .setColor("RANDOM")
            return message.channel.send(seekError2)
        }
        if(isNaN(args[0])) {
            const seekError3 = new MessageEmbed()
            .setDescription('Please Enter a Valid Number of seconds to seek')
            .setColor("RANDOM")
            return message.channel.send(seekError3)
        }

        const seekAmount = args[0] * 1000 

        client.distube.seek(message, seekAmount)
        message.react('✔️')
    }
}