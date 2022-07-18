const { MessageEmbed } = require('discord.js');
require('dotenv').config();
const Config = require('../../Config');
const rewardScore = Config.rewardScore;

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
    if (interaction.channel.id === '996274617276694579') {
      // Deal with command
      const tweetUrl = interaction.options.getString('url');
      //template: https://twitter.com/<name>}/status/<arguments>
      await interaction.channel.send(tweetUrl);
      const reply = await interaction.reply({
        content: 'loading...', //`${interaction.user.id}`,
      });
      // const message = await interaction.editReply({
      //   content: tweetUrl,
      // });

      //valid tweet url
      if (tweetUrl.includes('https://twitter.com/')) {
        try {
          const embed = new MessageEmbed()
            .setTitle('Review to Earn')
            .addField('User Id', interaction.user.id, true)
            .addField(
              'Review Rule',
              `👍 ${rewardScore}개 이상 받으면 리워드가 지급됩니다! (지급완료시 🎉)
                `,
              true
            )
            .addField('Tweet URL', tweetUrl, true);
          const resultMessage = await interaction.editReply({
            content: 'review to earn!',
            embeds: [embed],
            fetchReply: true,
          });
          await resultMessage.react('👍');
          await resultMessage.react('👎');
        } catch (error) {
          const resultMessage = await interaction.editReply({
            content: '실패했습니다. 재시도해주세요!',
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
        const message = await interaction.editReply({
          embeds: [embed],
          ephemeral: true,
        });
        setTimeout(() => {
          message.delete();
        }, 5000);
      }
    }
  },
};
