const { MessageEmbed } = require('discord.js');
require('dotenv').config();
const Config = require('../../Config');
const reviewRewardCount = Config.reviewRewardCount;
const Profile = require('../../Models/Profile');
const { createProfile } = require('../../Structures/Utils');

module.exports = {
  name: 'review',
  description: 'NFT review tweet 인증',
  options: [
    {
      name: 'url',
      description: 'insert your tweet URL',
      required: true,
      type: 'STRING',
    },
  ],
  type: 'COMMAND',
  run: async ({ interaction, options, bot, guild }) => {
    // console.log(interaction);
    if (!interaction.isCommand()) return;
    let reviewReward;
    let goodReviewReward;
    let userRoleText = '';

    const users = await bot.guilds.cache.get(guild.id);
    const member = await users.members.cache.get(interaction.user.id);

    if (member.roles.cache.find((e) => e.id === '969414258116923392')) {
      //holder
      reviewReward = Config.reward.holder.reviewReward;
      goodReviewReward = Config.reward.holder.goodReviewReward;
      userRoleText = '스타보이즈 홀더';
    } else {
      //not holder
      reviewReward = Config.reward.general.reviewReward;
      goodReviewReward = Config.reward.general.goodReviewReward;
      userRoleText = '(스타보이즈 홀더가 되시면 더 많은 보상을 받게됩니다.)';
    }

    let profile = await Profile.find({
      UserID: interaction.user.id,
      GuildID: guild.id,
    });
    if (!profile.length) {
      await createProfile(interaction.user, guild);
      profile = await Profile.find({
        UserID: interaction.user.id,
        GuildID: guild.id,
      });
    }

    // Deal with command
    const tweetUrl = interaction.options.getString('url');
    //template: https://twitter.com/<name>}/status/<arguments>

    // const message = await interaction.editReply({
    //   content: tweetUrl,
    // });

    //valid tweet url
    if (tweetUrl.includes('https://twitter.com/')) {
      if (
        !profile[0].lastReview ||
        Date.now() - profile[0].lastReview > 86400000
      ) {
        try {
          await interaction.channel.send(tweetUrl);
          const reply = await interaction.reply({
            content: 'loading...', //`${interaction.user.id}`,
          });
          const embed = new MessageEmbed()
            .setTitle('Review to Earn')
            .addField('User Id', interaction.user.id, true)
            .addField(
              `Review Rule <${userRoleText}>`,
              `👍 ${reviewRewardCount}개 이상 받으면 리워드(${goodReviewReward}SBT)가 지급됩니다! (지급완료시 🎉)
                리뷰보상 ${reviewReward}SBT 지급 완료!
                    `,
              true
            )
            .addField('Tweet URL', tweetUrl, true);
          await Profile.updateOne(
            { UserID: interaction.user.id, GuildID: guild.id },
            { $inc: { Wallet: reviewReward } }
          );
          const resultMessage = await interaction.editReply({
            content: 'review to earn!',
            embeds: [embed],
            fetchReply: true,
          });
          await resultMessage.react('👍');
          await resultMessage.react('👎');

          await Profile.updateOne(
            { UserID: interaction.user.id, GuildID: guild.id },
            { $set: { lastReview: Date.now() } }
          );
        } catch (error) {
          const resultMessage = await interaction.editReply({
            content: '실패했습니다. 재시도해주세요!',
          });
        }
      } else {
        const lastDaily = new Date(profile[0].lastReview);
        const timeLeft = Math.round(
          (lastDaily.getTime() + 86400000 - Date.now()) / 1000
        );
        const hours = Math.floor(timeLeft / 3600);
        const minutes = Math.floor((timeLeft - hours * 3600) / 60);
        const seconds = timeLeft - hours * 3600 - minutes * 60;
        const message = await interaction.reply({
          embeds: [
            new MessageEmbed()
              .setColor('BLURPLE')
              .setTitle(`${interaction.user.username}'s Review`)
              .setDescription(
                `You have to wait ${hours}h ${minutes}m ${seconds}s.`
              ),
          ],
          ephemeral: true,
        });
      }
      //리액션 일정 개수 넘어가면 보상 지급
    } else {
      const embed = new MessageEmbed().setTitle(
        `
            🚨 Invalid URL: 트윗 주소가 적절하지 않습니다!
            (이 메시지는 5초뒤에 사라집니다.)
            `
      );
      const message = await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
      setTimeout(() => {
        message.delete();
      }, 5000);
    }
  },
};
