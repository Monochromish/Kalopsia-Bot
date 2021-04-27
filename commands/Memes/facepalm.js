const Canvacord = require("canvacord/src/Canvacord");
const { MessageAttachment } = require("discord.js");

module.exports = {
    name: 'facepalm',
    description: "ugh",
    usage: "[prefix]facepalm",
    aliases: [],
    run: async(client, message, args) => {

        let mentionedMember = message.mentions.users.first() || message.author;
        if(!mentionedMember) mentionedMember = message.author
        let avatar = mentionedMember.displayAvatarURL({ dynamic: false, format: 'png' })     

        let image = await Canvacord.facepalm(avatar)
        let facepalm = new MessageAttachment(image, 'facepalm.png')

        message.channel.send(facepalm)
    }
}