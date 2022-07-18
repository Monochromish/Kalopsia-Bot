require('dotenv').config();
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const Config = require('../Config');
const structureConfig = require('../Structures/Config');
const Profile = require('../Models/Profile');
const { createProfile } = require('../Structures/Utils');

const reviewRewardCount = Config.reviewRewardCount;
const guildId = structureConfig.guildOnly.guildID;

module.exports = {
  event: 'messageReactionAdd',
  run: async (bot, interaction) => {
    if (interaction.emoji.name === '👍') {
      try {
        let msg = await interaction.message.fetch();
        if (msg.reactions.cache.get('👍').count >= reviewRewardCount) {
          const reviewUserId = msg?.embeds[0].fields.find(
            (e) => e.name === 'User Id'
          ).value;
          // const guild = bot.guild.fetch(interaction.guildId);
          //reward
          const profile = await Profile.find({
            UserID: member.id,
            GuildID: guildId,
          });
          if (!profile.length) {
            await createProfile(interaction.user, guild);
          }
          const users = await bot.guilds.cache.get(guildId);
          const member = await users.members.cache.get(reviewUserId);

          if (member.roles.cache.find((e) => e.id === '969414258116923392')) {
            //홀더
            await Profile.updateOne(
              { UserID: member.id, GuildID: guildId },
              { $inc: { Wallet: Config.reward.holder.goodReviewReward } }
            );
          } else {
            //비홀더
            await Profile.updateOne(
              { UserID: member.id, GuildID: guildId },
              { $inc: { Wallet: Config.reward.general.goodReviewReward } }
            );
          }
          await msg.react('🎉');
        }
      } catch (err) {
        console.log(err);
      }
    }
  },
};
