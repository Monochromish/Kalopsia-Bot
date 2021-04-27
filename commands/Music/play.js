const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "play",
    description: "Play Songs",
    usage: "[prefix]play <Song Name / URL>",
    aliases: ["p"],
    run: async (client, message, args) => {
      if (!message.member.voice.channel) {
        const playError = new MessageEmbed()
          .setDescription("Please join a VC")
          .setColor("RANDOM")
        return message.channel.send(playError)
      }
      const voiceChannel = message.member.voice.channel
      const permissions = voiceChannel.permissionsFor(message.client.user)
      if (!permissions.has("SPEAK")) {
        const playError2 = new MessageEmbed()
          .setDescription("I Don\'t Have Permissions to Speak in this VC")
          .setColor("RANDOM")
        return message.channel.send(playError2)
      }
      if (!permissions.has("CONNECT")) {
        const playError3 = new MessageEmbed()
          .setDescription("I Don\'t Have Permissions to Connect to the VC you are in...")
          .setColor("RANDOM")
        return message.channel.send(playError3)
      }

      let songName = args.slice(0).join(" ")
      if (!songName) {
        const playError2 = new MessageEmbed()
          .setDescription("Please provide a Song Name or Song URL")
          .setColor("RED")
        return message.channel.send(playError2)
      }

      try {
        voiceChannel.join().then(connection => {
          connection.voice.setSelfDeaf(true)
        })
        client.distube.play(message, songName)
      } catch (err) {
        message.channel.send(`ERR - Cannot play the song! \n Error: ||${err}||`)
      }
  },
};
