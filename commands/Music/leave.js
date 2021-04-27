module.exports = {
    name: 'leave',
    description: "Leaves The VC",
    aliases: ['dc', 'disconnect', 'exit'],
    run: async(client, message, args) => {

        const voiceChannel = message.member.voice.channel

        if (!voiceChannel) return message.channel.send("I\'m Not In A VC")

        try {
            voiceChannel.leave()
        } catch(error) {
            console.log(`ERR - Cannot disconnect To The VC : ${error}`)
            return message.channel.send(`ERR - Cannot disconnect To The VC : ${error}`)
        }
    }
}