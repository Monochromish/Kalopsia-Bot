const { MessageEmbed } = require('discord.js');
const Profile = require('../../Models/Profile');
const { createProfile } = require('../../Structures/Utils');

module.exports = {
  name: 'daily',
  description: 'Collect daily earnings. 24hr cool down.',
  category: 'Economy',
  async run({ interaction, options, bot, guild }) {
    const profile = await Profile.find({ UserID: interaction.user.id, GuildID: guild.id });
    if (!profile.length) {
      await createProfile(interaction.user, guild);
      await interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor('BLURPLE')
            .setDescription(`Creating profile.\nUse this command again to collect your daily earnings.`)
        ]
      });
    } else {
      if (!profile[0].lastDaily) {
        await Profile.updateOne(
          { UserID: interaction.user.id, GuildID: guild.id },
          { $set: { lastDaily: Date.now() } }
        );
        await Profile.updateOne({ UserID: interaction.user.id, GuildID: guild.id }, { $inc: { Wallet: 25 } });
        await interaction.reply({
          embeds: [
            new MessageEmbed()
              .setColor('BLURPLE')
              .setTitle(`${interaction.user.username}'s Daily`)
              .setDescription(`You have collected today's earnings (25€).\nCome back tomorrow to collect more.`)
          ]
        });
      } else if (Date.now() - profile[0].lastDaily > 86400000) {
        await Profile.updateOne(
          { UserID: interaction.user.id, GuildID: guild.id },
          { $set: { lastDaily: Date.now() } }
        );
        await Profile.updateOne({ UserID: interaction.user.id, GuildID: guild.id }, { $inc: { Wallet: 25 } });
        await interaction.reply({
          embeds: [
            new MessageEmbed()
              .setColor('BLURPLE')
              .setTitle(`${interaction.user.username}'s Daily`)
              .setDescription(`You have collected your daily earnings.`)
          ]
        });
      } else {
        const lastDaily = new Date(profile[0].lastDaily);
        const timeLeft = Math.round((lastDaily.getTime() + 86400000 - Date.now()) / 1000);
        const hours = Math.floor(timeLeft / 3600);
        const minutes = Math.floor((timeLeft - hours * 3600) / 60);
        const seconds = timeLeft - hours * 3600 - minutes * 60;
        await interaction.reply({
          embeds: [
            new MessageEmbed()
              .setColor('BLURPLE')
              .setTitle(`${interaction.user.username}'s Daily`)
              .setDescription(
                `You have to wait ${hours}h ${minutes}m ${seconds}s before you can collect your daily earnings.`
              )
          ]
        });
      }
    }
  }
};
