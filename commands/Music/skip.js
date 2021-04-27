const { MessageEmbed } = require("discord.js")

module.exports = {
    name: 'skip',
    description: "Skips Music in Queue",
    usage: "[prefix]skip",
    aliases: [],
    run: async(client, message, args)=> {
        if (!message.member.voice.channel) {
            const skipError = new MessageEmbed()
              .setDescription("Please join a VC")
              .setColor("RED")
            return message.channel.send(skipError)
        }
        if(!client.distube.isPlaying(message)) {
            const skipError2 = new MessageEmbed()
            .setDescription("There is Nothing Playing")
            .setColor("RANDOM")
            return message.channel.send(skipError2)
        }

        let queue = client.distube.skip(message)

        const embed = new MessageEmbed()
        .setDescription(`Song has been skipped`)
        .setColor("RANDOM")

        message.channel.send(embed)
    }
}