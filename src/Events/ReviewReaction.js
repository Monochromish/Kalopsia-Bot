require('dotenv').config();
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);
const Config = require('../Config');
const structureConfig = require('../Structures/Config');
const Profile = require('../Models/Profile');

const rewardScore = Config.rewardScore;
const guildId = structureConfig.guildOnly.guildID;

module.exports = {
  event: 'messageReactionAdd',
  run: async (bot, interaction) => {
    if (interaction.emoji.name === '👍') {
      try {
        let msg = await interaction.message.fetch();
        if (msg.reactions.cache.get('👍').count >= rewardScore) {
          const reviewUserId = msg?.embeds[0].fields.find(
            (e) => e.name === 'User Id'
          ).value;
          // const guild = bot.guild.fetch(interaction.guildId);
          const users = await bot.guilds.cache.get(guildId);
          const member = await users.members.cache.get(reviewUserId);

          //reward
          const profile = await Profile.find({
            UserID: member.id,
            GuildID: guildId,
          });
          if (member.roles.cache.find((e) => e.id === '969414258116923392')) {
            console.log('홀더');
            //홀더
          } else {
            //비홀더
          }
          await msg.react('🎉');
        }
      } catch (err) {
        console.log(err);
      }
    }
  },
};
