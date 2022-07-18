const { MessageEmbed } = require('discord.js');
const Profile = require('../../Models/Profile');
const { createProfile } = require('../../Structures/Utils');
const { MonthlyReward } = require('../../Config');
const structureConfig = require('../../Structures/Config');
const guildId = structureConfig.guildOnly.guildID;

module.exports = {
  name: 'monthly',
  description:
    'Collect monthly earnings. 30d cool down. (For Starboys holders only)',
  category: 'Economy',
  async run({ interaction, options, bot, guild }) {
    await interaction.reply({
      embeds: [
        new MessageEmbed()
          .setColor('BLURPLE')
          .setTitle(`${interaction.user.username}'s Monthly`)
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
    //             `Creating profile.\nUse this command again to collect your monthly earnings.`
    //           ),
    //       ],
    //     });
    //   } else {
    //     if (!profile[0].lastMonthly) {
    //       await Profile.updateOne(
    //         { UserID: interaction.user.id, GuildID: guild.id },
    //         { $set: { lastMonthly: Date.now() } }
    //       );
    //       await Profile.updateOne(
    //         { UserID: interaction.user.id, GuildID: guild.id },
    //         { $inc: { Wallet: MonthlyReward } }
    //       );
    //       await interaction.reply({
    //         embeds: [
    //           new MessageEmbed()
    //             .setColor('BLURPLE')
    //             .setTitle(`${interaction.user.username}'s Monthly`)
    //             .setDescription(
    //               `You have collected this month's earnings (${MonthlyReward}SBT).\nCome back next month to collect more.`
    //             ),
    //         ],
    //       });
    //     } else if (Date.now() - profile[0].lastMonthly > 2592000000) {
    //       await Profile.updateOne(
    //         { UserID: interaction.user.id, GuildID: guild.id },
    //         { $set: { lastMonthly: Date.now() } }
    //       );
    //       await Profile.updateOne(
    //         { UserID: interaction.user.id, GuildID: guild.id },
    //         { $inc: { Wallet: MonthlyReward } }
    //       );
    //       await interaction.reply({
    //         embeds: [
    //           new MessageEmbed()
    //             .setColor('BLURPLE')
    //             .setTitle(`${interaction.user.username}'s Monthly`)
    //             .setDescription(
    //               `You have collected your monthly earnings. (${MonthlyReward}SBT)`
    //             ),
    //         ],
    //       });
    //     } else {
    //       await interaction.reply({
    //         embeds: [
    //           new MessageEmbed()
    //             .setColor('BLURPLE')
    //             .setTitle(`${interaction.user.username}'s Monthly`)
    //             .setDescription(
    //               `You have collected this month's earnings.\nCome back next month to collect more.`
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
    //         .setTitle(`${interaction.user.username}'s Monthly`)
    //         .setDescription(`Only the holder can`),
    //     ],
    //   });
    // }
  },
};
