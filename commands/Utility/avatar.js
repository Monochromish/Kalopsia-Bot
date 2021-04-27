const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'avatar',
    description: "Get Mentioned Users Avatar",
    usage: "[prefix]avatar",
    aliases: ["avatar", "av"],
    nsfwOnly: true,
    run: async(client, message, args) => {
        const member = message.mentions.users.first() || message.author;
        const avatar = member.displayAvatarURL({ dynamic: true, size: 1024 })

        const embed = new MessageEmbed()
        .setTitle(`${member.tag}\'s Avatar`)
        .setImage(avatar)
        .setColor("RANDOM")

        message.channel.send(embed)
    }
}