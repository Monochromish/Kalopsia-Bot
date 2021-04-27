module.exports = {
    name: 'join',
    description: "Joins The VC",
    usage: "[prefix]join",
    aliases: ['summon', 'enter'],
    run: async(client, message, args) => {

        const voiceChannel = message.member.voice.channel

        if (!voiceChannel) return message.channel.send("Please join a VC")

        try {
            await voiceChannel.join().then(connection => {
                connection.voice.setSelfDeaf(true)
            })
        } catch(error) {
            console.log(`ERR - Cannot connect To The Voice Channel : ${error}`)
            return message.channel.send(`ERR - Cannot connect To The Voice Channel : ${error}`)
        }
    }
}