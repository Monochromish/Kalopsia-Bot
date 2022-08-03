const { MessageEmbed } = require('discord.js');
const postResultGoogleSheet = require('../../Structures/postResultGoogleSheet');

module.exports = {
  name: 'daily-check-result',
  description: `Print user's daily check result to google sheet`,
  permission: 'ADMINISTRATOR',
  type: 'COMMAND',
  run: async ({ interaction, guild }) => {
    const dailyCheckChannelId = '1001799413674541096';
    // const dailyCheckChannelId = '998515589230374964';
    const channel = guild.channels.cache.get(dailyCheckChannelId);
    const resultTestChannelId = '1003470340481101906';
    const dailyCheckMessages = new Map();
    const todayEarnings = "You have collected today's earnings";
    const dailyEarnings = 'You have collected your daily earnings';
    const sheetId = '823267993';
    const sheetName = 'daily-check';
    const dailyCheckRequests = [];
    const dailyCheckData = [];
    let startRowIndex = 1,
      endRowIndex = 1;
    let beforeMessageId = null;

    // if (interaction.channelId !== resultTestChannelId) {
    //   await interaction.reply({
    //     embeds: [
    //       new MessageEmbed()
    //         .setColor('RED')
    //         .setDescription('Run this command in result-test channel'),
    //     ],
    //   });
    //   return;
    // }

    await interaction.deferReply();

    while (beforeMessageId !== 'end') {
      await channel.messages
        .fetch({ limit: 100, before: beforeMessageId })
        .then((page) => {
          page.forEach((message) => {
            const contents = message.embeds[0];
            if (
              contents?.description.includes(todayEarnings) ||
              contents?.description.includes(dailyEarnings)
            ) {
              const username = message.interaction?.user.username;
              const userId = message.interaction?.user.id;
              const date = new Date(message.createdTimestamp)
                .toISOString()
                .slice(0, 10);
              if (dailyCheckMessages.has(userId)) {
                dailyCheckMessages.get(userId).date.push([date]);
                dailyCheckMessages.get(userId).count += 1;
              } else {
                const value = {
                  userId: userId,
                  userName: username,
                  date: [[date]],
                  count: 1,
                };
                dailyCheckMessages.set(userId, value);
              }
            }
          });
          beforeMessageId =
            0 < page.size ? [...page][page.size - 1][1].id : 'end';
        });
    }

    dailyCheckMessages.forEach((message) => {
      const dailyLength = message.date.length;
      startRowIndex = endRowIndex;
      endRowIndex += dailyLength;
      dailyCheckRequests.push({
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
      dailyCheckRequests.push({
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
      dailyCheckRequests.push({
        mergeCells: {
          mergeType: 'MERGE_COLUMNS',
          range: {
            sheetId: sheetId,
            startRowIndex: startRowIndex,
            endRowIndex: endRowIndex,
            startColumnIndex: 3,
            endColumnIndex: 4,
          },
        },
      });
      dailyCheckRequests.push({
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
            endColumnIndex: 4,
          },
          fields: 'userEnteredFormat(horizontalAlignment)',
        },
      });
      dailyCheckData.push({
        range: `${sheetName}!A${startRowIndex + 1}:B${startRowIndex + 1}`,
        values: [[message.userName, message.userId]],
      });
      dailyCheckData.push({
        range: `${sheetName}!C${startRowIndex + 1}:C${endRowIndex}`,
        values: message.date,
      });
      dailyCheckData.push({
        range: `${sheetName}!D${startRowIndex + 1}:D${startRowIndex + 1}`,
        values: [[message.count]],
      });
    });

    const totalParticipantCount = dailyCheckMessages.size;

    dailyCheckRequests.push({
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

    dailyCheckData.push({
      range: `${sheetName}!A${endRowIndex + 1}:B${endRowIndex + 1}`,
      values: [['Total', totalParticipantCount]],
    });

    await postResultGoogleSheet(
      sheetId,
      sheetName,
      dailyCheckRequests,
      dailyCheckData
    );
    await interaction.editReply({
      embeds: [
        new MessageEmbed()
          .setColor('BLURPLE')
          .setTitle(`Success Print! Check google sheet.`)
          .setDescription('Check google sheet right now!'),
      ],
    });
  },
};
