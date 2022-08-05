const { MessageEmbed } = require('discord.js');
const postResultGoogleSheet = require('../../Structures/postResultGoogleSheet');

module.exports = {
  name: 'review-result',
  description: `Print user's review result to google sheet`,
  permission: 'ADMINISTRATOR',
  type: 'COMMAND',
  run: async ({ interaction, guild }) => {
    const reviewChannelId = '997434793505595492';
    // const reviewChannelId = '1001351273309814874';
    const resultTestChannelId = '1003470340481101906';
    const channel = guild.channels.cache.get(reviewChannelId);
    const reviewMessages = new Map();
    const sheetId = '643690313';
    const sheetName = 'review';
    const reviewRequests = [];
    const reviewData = [];
    let startRowIndex = 1,
      endRowIndex = 1;
    let beforeMessageId = null;

    if (interaction.channelId !== resultTestChannelId) {
      await interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor('RED')
            .setDescription('Run this command in result-test channel'),
        ],
      });
      return;
    }

    await interaction.deferReply();

    while (beforeMessageId !== 'end') {
      await channel.messages
        .fetch({ limit: 100, before: beforeMessageId })
        .then((page) => {
          page.forEach((message) => {
            const contents = message.embeds[0];
            if (
              contents?.title === 'Review to Earn' &&
              contents?.fields?.length === 3
            ) {
              const userId = contents.fields[0].value;
              const username = message.interaction?.user.username;
              const goodCount = message.reactions.cache.get('👍').count;
              const tweetUrl = contents.fields[2].value;
              if (reviewMessages.has(userId)) {
                reviewMessages.get(userId).review.push([tweetUrl, goodCount]);
              } else {
                const value = {
                  userId: userId,
                  userName: username,
                  review: [[tweetUrl, goodCount]],
                };
                reviewMessages.set(userId, value);
              }
            }
          });
          beforeMessageId =
            0 < page.size ? [...page][page.size - 1][1].id : 'end';
        });
    }

    const totalParticipantCount = reviewMessages.size;

    reviewMessages.forEach((message) => {
      const reviewLength = message.review.length;
      startRowIndex = endRowIndex;
      endRowIndex += reviewLength;
      reviewRequests.push({
        mergeCells: {
          mergeType: 'MERGE_COLUMNS',
          range: {
            sheetId: sheetId,
            startRowIndex: startRowIndex,
            endRowIndex: endRowIndex,
            startColumnIndex: 0,
            endColumnIndex: 1,
          },
        },
      });
      reviewRequests.push({
        mergeCells: {
          mergeType: 'MERGE_COLUMNS',
          range: {
            sheetId: sheetId,
            startRowIndex: startRowIndex,
            endRowIndex: endRowIndex,
            startColumnIndex: 1,
            endColumnIndex: 2,
          },
        },
      });
      reviewRequests.push({
        updateCells: {
          rows: [
            {
              values: [
                {
                  userEnteredFormat: {
                    horizontalAlignment: 'CENTER',
                  },
                },
              ],
            },
          ],
          range: {
            sheetId: sheetId,
            startRowIndex: startRowIndex,
            endRowIndex: endRowIndex,
            startColumnIndex: 0,
            endColumnIndex: 2,
          },
          fields: 'userEnteredFormat(horizontalAlignment)',
        },
      });
      reviewData.push({
        range: `${sheetName}!A${startRowIndex + 1}:B${startRowIndex + 1}`,
        values: [[message.userName, message.userId]],
      });
      reviewData.push({
        range: `${sheetName}!C${startRowIndex + 1}:D${endRowIndex}`,
        values: message.review,
      });
    });
    reviewRequests.push({
      repeatCell: {
        range: {
          sheetId: sheetId,
          startRowIndex: endRowIndex,
          endRowIndex: endRowIndex + 1,
          startColumnIndex: 0,
          endColumnIndex: 4,
        },
        cell: {
          userEnteredFormat: {
            backgroundColor: {
              red: 0.8,
              green: 0.5,
              blue: 0.5,
            },
            textFormat: {
              bold: true,
            },
          },
        },
        fields: 'userEnteredFormat(backgroundColor, textFormat)',
      },
    });
    reviewData.push({
      range: `${sheetName}!A${endRowIndex + 1}:B${endRowIndex + 1}`,
      values: [['Total', totalParticipantCount]],
    });

    await postResultGoogleSheet(sheetId, sheetName, reviewRequests, reviewData);
    await interaction.editReply({
      embeds: [
        new MessageEmbed()
          .setColor('BLURPLE')
          .setTitle(`Success Print! Check google sheet.`)
          .setDescription('Check google sheet right now'),
      ],
    });
  },
};
