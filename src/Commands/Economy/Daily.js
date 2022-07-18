const { MessageEmbed } = require('discord.js');
const Profile = require('../../Models/Profile');
const { createProfile } = require('../../Structures/Utils');
const { reward } = require('../../Config');
const structureConfig = require('../../Structures/Config');
const guildId = structureConfig.guildOnly.guildID;

module.exports = {
  name: 'daily',
  description:
    'Collect daily earnings. 24hr cool down. (For Starboys holders only)',
  category: 'Economy',
  async run({ interaction, options, bot, guild }) {
    const users = await bot.guilds.cache.get(guildId);
    const member = await users.members.cache.get(interaction.user.id);
    if (member.roles.cache.find((e) => e.id === '969414258116923392')) {
      const profile = await Profile.find({
        UserID: interaction.user.id,
        GuildID: guild.id,
      });
      if (!profile.length) {
        await createProfile(interaction.user, guild);
        await interaction.reply({
          embeds: [
            new MessageEmbed()
              .setColor('BLURPLE')
              .setDescription(
                `Creating profile.\nUse this command again to collect your daily earnings.`
              ),
          ],
        });
      } else {
        if (!profile[0].lastDaily) {
          await Profile.updateOne(
            { UserID: interaction.user.id, GuildID: guild.id },
            { $set: { lastDaily: Date.now() } }
          );
          await Profile.updateOne(
            { UserID: interaction.user.id, GuildID: guild.id },
            { $inc: { Wallet: reward.holder.DailyReward } }
          );
          await interaction.reply({
            embeds: [
              new MessageEmbed()
                .setColor('BLURPLE')
                .setTitle(`${interaction.user.username}'s Daily`)
                .setDescription(
                  `You have collected today's earnings (${reward.holder.DailyReward}SBT).\nCome back tomorrow to collect more.`
                ),
            ],
          });
        } else if (Date.now() - profile[0].lastDaily > 86400000) {
          await Profile.updateOne(
            { UserID: interaction.user.id, GuildID: guild.id },
            { $set: { lastDaily: Date.now() } }
          );
          await Profile.updateOne(
            { UserID: interaction.user.id, GuildID: guild.id },
            { $inc: { Wallet: reward.holder.DailyReward } }
          );
          await interaction.reply({
            embeds: [
              new MessageEmbed()
                .setColor('BLURPLE')
                .setTitle(`${interaction.user.username}'s Daily`)
                .setDescription(
                  `You have collected your daily earnings. (${reward.holder.DailyReward}SBT)`
                ),
            ],
          });
        } else {
          const lastDaily = new Date(profile[0].lastDaily);
          const timeLeft = Math.round(
            (lastDaily.getTime() + 86400000 - Date.now()) / 1000
          );
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
                ),
            ],
          });
        }
      }
    } else {
      await interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor('BLURPLE')
            .setTitle(`${interaction.user.username}'s Daily`)
            .setDescription(`Only the holder can`),
        ],
      });
    }
  },
};
