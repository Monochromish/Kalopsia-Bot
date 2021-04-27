const canvacord = require('canvacord');
const Canvacord = require('canvacord/src/Canvacord');
const { MessageAttachment, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'shit',
    description: "EWWWWWWWWWWW",
    usage: "[prefix]shit",
    run: async(client, message, args) => {
        const member = message.mentions.users.first() || message.author;
        const mentionedMemberAvatar = member.displayAvatarURL({dynamic: false, format: "png"})

        if(!member) {
            const shitError = new MessageEmbed()
            .setDescription(`You'll Need to mention a member, or do you wanna use the command on yourself? xD`)
            .setColor("RANDOM")
            return message.channel.send(shitError)
        }

        let image = await Canvacord.shit(mentionedMemberAvatar)

        let shit = new MessageAttachment(image, "shit.png")

        message.channel.send(shit)
    }
}