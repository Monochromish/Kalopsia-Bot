const { MessageEmbed } = require('discord.js');
const postResultGoogleSheet = require('../../Structures/postResultGoogleSheet');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);

module.exports = {
  name: 'vote-result',
  description: `Print vote result to google sheet`,
  permission: 'ADMINISTRATOR',
  type: 'COMMAND',
  run: async ({ interaction }) => {
    const voteStatus = db.get('voteStatus').value();
    const voteId = voteStatus.voteId;
    const resultTestChannelId = '1003470340481101906';
    const sheetId = '234088626';
    const sheetName = 'vote';
    const voteRequests = [];
    const voteData = [];
    let startRowIndex = 1;

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

    const fetchVotingData = db
      .get('voteUser')
      .value()
      .filter((e) => e.voteId === voteId);
    const votingData = Array.isArray(fetchVotingData)
      ? fetchVotingData
      : [fetchVotingData];
    const bluechipCountObject = votingData.reduce((r, e) => {
      if (e.bluechipChoice && e.bluechipChoice.length > 0) {
        r[`${e.bluechipChoice}`] = (r[`${e.bluechipChoice}`] || 0) + 1;
      }
      return r;
    }, {});
    const totalBluechipVoteCount = Object.entries(bluechipCountObject).reduce(
      (total, e) => (total += e[1]),
      0
    );
    const bluechipCountArray = Object.entries(bluechipCountObject).map((e) => {
      return [
        e[0],
        e[1],
        `${((e[1] / totalBluechipVoteCount) * 100).toFixed(2)}%`,
      ];
    });
    const risingCountObject = votingData.reduce((r, e) => {
      if (e.risingChoice && e.risingChoice.length > 0) {
        r[`${e.risingChoice}`] = (r[`${e.risingChoice}`] || 0) + 1;
      }
      return r;
    }, {});
    const totalRisingVoteCount = Object.entries(risingCountObject).reduce(
      (total, e) => (total += e[1]),
      0
    );
    const risingCountArray = Object.entries(risingCountObject).map((e) => {
      return [
        e[0],
        e[1],
        `${((e[1] / totalRisingVoteCount) * 100).toFixed(2)}%`,
      ];
    });
    const totalParticipantCount = fetchVotingData.length;
    const bluechipCountLength = bluechipCountArray.length;
    const risingCountLength = risingCountArray.length;

    const maxLength = Math.max(bluechipCountLength, risingCountLength);

    voteData.push({
      range: `${sheetName}!A${startRowIndex + 1}:C${bluechipCountLength + 1}`,
      values: bluechipCountArray,
    });
    voteData.push({
      range: `${sheetName}!D${startRowIndex + 1}:F${risingCountLength + 1}`,
      values: risingCountArray,
    });

    voteRequests.push({
      repeatCell: {
        range: {
          sheetId: sheetId,
          startRowIndex: maxLength + 1,
          endRowIndex: maxLength + 3,
          startColumnIndex: 0,
          endColumnIndex: 6,
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

    voteData.push({
      range: `${sheetName}!A${maxLength + 2}:E${maxLength + 4}`,
      values: [
        ['Total', totalBluechipVoteCount, '', '', totalRisingVoteCount],
        ['Total Participant', totalParticipantCount, '', '', ''],
      ],
    });

    await postResultGoogleSheet(sheetId, sheetName, voteRequests, voteData);
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
