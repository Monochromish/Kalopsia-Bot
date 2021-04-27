const { MessageEmbed } = require("discord.js")

module.exports = {
    name: 'resume',
    description: "Resume Music",
    usage: '[prefix]resume',
    aliases: ['resume', 'unpause'],
    run: async(client, message, args) => {
        if (!message.member.voice.channel) {
            const resumeError = new MessageEmbed()
              .setDescription("Please join a VC")
              .setColor("RED")
            return message.channel.send(resumeError)
        }
        // if(!client.distube.isPlaying(message)) {
        //     const resumeError2 = new MessageEmbed()
        //     .setDescription("There is Nothing Playing")
        //     .setColor("RED")
        //     return message.channel.send(resumeError2)
        // }
        let queue = client.distube.getQueue(message);
        if (!queue) {
            const queueError = new MessageEmbed()
            .setDescription("There is Nothing Playing")
            .setColor("RANDOM")
            return message.channel.send(queueError)
        }
        if(!client.distube.isPaused(message)) {
            const resumeError3 = new MessageEmbed()
            .setDescription('The song is not Paused')
            .setColor("RANDOM")
            return message.channel.send(resumeError3)
        }

        client.distube.resume(message)
        const embed = new MessageEmbed()
        .setDescription('Song has been resumed')
        .setColor("RANDOM")
        message.channel.send(embed)
    }
}