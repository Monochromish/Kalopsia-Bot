const warnSchema = require("../../models/warnSchema");
const mongoose = require("mongoose");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "warnings",
  description: "Check warnings",
  usage: "[prefix]warnings <@member>",
  aliases: ["warnlist", "listwarnings", "warns"],
  run: async (client, message, args) => {
    const mentionedUser = message.mentions.users.first() || message.member;

    const warnDoc = await warnSchema
      .findOne({
        guildID: message.guild.id,
        memberID: mentionedUser.id,
      })
      .catch((err) => console.log(err));

    if (!warnDoc || !warnDoc.warnings.length) {
      return message.channel.send(`${mentionedUser} has no warnings`);
    }

    const data = [];

    for (let i = 0; warnDoc.warnings.length > i; i++) {
      data.push(`**ID:** ${i + 1}`);
      data.push(`**Reason:** ${warnDoc.warnings[i]}`);
      data.push(
        `**Moderator:** ${await message.client.users
          .fetch(warnDoc.moderator[i])
          .catch(() => "Deleted User")}`
      );
      data.push(
        `**Date:** ${new Date(warnDoc.date[i]).toLocaleDateString()}\n`
      );
    }

    const embed = new MessageEmbed()
      .setThumbnail(mentionedUser.displayAvatarURL({ dynamic: false }))
      .setColor("RANDOM")
      .setDescription(data.join("\n"));

    message.channel.send(embed);
  },
};
