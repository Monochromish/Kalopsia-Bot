const Canvacord = require("canvacord/src/Canvacord")
const { MessageAttachment } = require("discord.js")

module.exports = {
    name: 'kiss',
    description: "Kiss other member.",
    usage: "[prefix]kiss <mentionSomeone>",
    run: async(client, message, args) => {
        const member = message.mentions.users.first() || message.author;
        if(!member) return message.channel.send('No members mentioned. Please mention the person you wanna kiss ;)')
        const mentionedMemberAvatar = member.displayAvatarURL({dynamic: false, format: "png"})
        const messageAuthorAvatar = message.author.displayAvatarURL({dynamic: false, format: "png"})

        let image = await Canvacord.kiss(mentionedMemberAvatar, messageAuthorAvatar)

        let kiss = new MessageAttachment(image, "kiss.png")

        message.channel.send(kiss)

    }
}