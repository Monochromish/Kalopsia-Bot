const { MessageEmbed } = require("discord.js")

module.exports = {
    name: 'autoplay',
    description: "Toggles Autoplay to ON / OFF",
    usage: "[prefix]autoplay",
    aliases: ['autop'],
    run: async(client, message, args) => {
        if (!message.member.voice.channel) {
            const autoplayError = new MessageEmbed()
              .setDescription("Please join a VC")
              .setColor("RANDOM")
            return message.channel.send(autoplayError)
        }
        if(!client.distube.isPlaying(message)) {
            const autoplayError2 = new MessageEmbed()
            .setDescription("There is Nothing Playing")
            .setColor("RANDOM")
            return message.channel.send(autoplayError2)
        }

        let mode = client.distube.toggleAutoplay(message)
        const embed = new MessageEmbed()
        .setDescription(`Autoplay Mode has been Set to :\`` + (mode ? "On" : "Off") + "\`")
        .setColor("RANDOM")
        message.channel.send(embed)
    }
}