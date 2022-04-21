const { MessageEmbed } = require('discord.js');
const Profile = require('../../Models/Profile');
const { createProfile } = require('../../Structures/Utils');

module.exports = {
  name: 'monthly',
  description: 'Collect monthly earnings. 30d cool down.',
  category: 'Economy',
  async run({ interaction, options, bot, guild }) {
    const profile = await Profile.find({ UserID: interaction.user.id, GuildID: guild.id });
    if (!profile.length) {
      await createProfile(interaction.user, guild);

      await interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor('BLURPLE')
            .setDescription(`Creating profile.\nUse this command again to collect your monthly earnings.`)
        ]
      });
    } else {
      if (!profile[0].lastMonthly) {
        await Profile.updateOne(
          { UserID: interaction.user.id, GuildID: guild.id },
          { $set: { lastMonthly: Date.now() } }
        );
        await Profile.updateOne({ UserID: interaction.user.id, GuildID: guild.id }, { $inc: { Wallet: 500 } });
        await interaction.reply({
          embeds: [
            new MessageEmbed()
              .setColor('BLURPLE')
              .setTitle(`${interaction.user.username}'s Monthly`)
              .setDescription(`You have collected this month's earnings (500€).\nCome back next month to collect more.`)
          ]
        });
      } else if (Date.now() - profile[0].lastMonthly > 2592000000) {
        await Profile.updateOne(
          { UserID: interaction.user.id, GuildID: guild.id },
          { $set: { lastMonthly: Date.now() } }
        );
        await Profile.updateOne({ UserID: interaction.user.id, GuildID: guild.id }, { $inc: { Wallet: 500 } });
        await interaction.reply({
          embeds: [
            new MessageEmbed()
              .setColor('BLURPLE')
              .setTitle(`${interaction.user.username}'s Monthly`)
              .setDescription(`You have collected your monthly earnings.`)
          ]
        });
      } else {
        await interaction.reply({
          embeds: [
            new MessageEmbed()
              .setColor('BLURPLE')
              .setTitle(`${interaction.user.username}'s Monthly`)
              .setDescription(`You have collected this month's earnings.\nCome back next month to collect more.`)
          ]
        });
      }
    }
  }
};
