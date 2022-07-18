const { MessageEmbed } = require('discord.js');
const Profile = require('../../Models/Profile');
const { createProfile } = require('../../Structures/Utils');
const { WeeklyReward } = require('../../Config');
const structureConfig = require('../../Structures/Config');
const guildId = structureConfig.guildOnly.guildID;

module.exports = {
  name: 'weekly',
  description:
    'Collect weekly earnings. 7d cool down. (For Starboys holders only)',
  category: 'Economy',
  async run({ interaction, options, bot, guild }) {
    await interaction.reply({
      embeds: [
        new MessageEmbed()
          .setColor('BLURPLE')
          .setTitle(`${interaction.user.username}'s Weekly`)
          .setDescription(`Coming soon`),
      ],
    });

    // const users = await bot.guilds.cache.get(guildId);
    // const member = await users.members.cache.get(interaction.user.id);
    // if (member.roles.cache.find((e) => e.id === '969414258116923392')) {
    //   const profile = await Profile.find({
    //     UserID: interaction.user.id,
    //     GuildID: guild.id,
    //   });
    //   if (!profile.length) {
    //     await createProfile(interaction.user, guild);
    //     await interaction.reply({
    //       embeds: [
    //         new MessageEmbed()
    //           .setColor('BLURPLE')
    //           .setDescription(
    //             `Creating profile.\nUse this command again to collect your weekly earnings.`
    //           ),
    //       ],
    //     });
    //   } else {
    //     if (!profile[0].lastWeekly) {
    //       await Profile.updateOne(
    //         { UserID: interaction.user.id, GuildID: guild.id },
    //         { $set: { lastWeekly: Date.now() } }
    //       );
    //       await Profile.updateOne(
    //         { UserID: interaction.user.id, GuildID: guild.id },
    //         { $inc: { Wallet: WeeklyReward } }
    //       );
    //       await interaction.reply({
    //         embeds: [
    //           new MessageEmbed()
    //             .setColor('BLURPLE')
    //             .setTitle(`${interaction.user.username}'s Weekly`)
    //             .setDescription(
    //               `You have collected this week's earnings (${WeeklyReward}SBT).\nCome back next week to collect more.`
    //             ),
    //         ],
    //       });
    //     } else if (Date.now() - profile[0].lastWeekly > 604800000) {
    //       await Profile.updateOne(
    //         { UserID: interaction.user.id, GuildID: guild.id },
    //         { $set: { lastWeekly: Date.now() } }
    //       );
    //       await Profile.updateOne(
    //         { UserID: interaction.user.id, GuildID: guild.id },
    //         { $inc: { Wallet: WeeklyReward } }
    //       );
    //       await interaction.reply({
    //         embeds: [
    //           new MessageEmbed()
    //             .setColor('BLURPLE')
    //             .setTitle(`${interaction.user.username}'s Weekly`)
    //             .setDescription(
    //               `You have collected your weekly earnings. (${WeeklyReward}SBT)`
    //             ),
    //         ],
    //       });
    //     } else {
    //       await interaction.reply({
    //         embeds: [
    //           new MessageEmbed()
    //             .setColor('BLURPLE')
    //             .setTitle(`${interaction.user.username}'s Weekly`)
    //             .setDescription(
    //               `You have collected your weekly earnings.\nCome back next week to collect more.`
    //             ),
    //         ],
    //       });
    //     }
    //   }
    // } else {
    //   await interaction.reply({
    //     embeds: [
    //       new MessageEmbed()
    //         .setColor('BLURPLE')
    //         .setTitle(`${interaction.user.username}'s Weekly`)
    //         .setDescription(`Only the holder can`),
    //     ],
    //   });
    // }
  },
};
