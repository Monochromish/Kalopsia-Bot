const { MessageEmbed } = require('discord.js');
const structureConfig = require('../../Structures/Config');
const postResultGoogleSheet = require('../../Structures/postResultGoogleSheet');
const guildId = structureConfig.guildOnly.guildID;
const Profile = require('../../Models/Profile');

module.exports = {
  name: 'balance-result',
  description: `Print user's balance to google sheet`,
  permission: 'ADMINISTRATOR',
  type: 'COMMAND',
  async run({ interaction, bot }) {
    const guild = await bot.guilds.cache.get(guildId);
    const members = await guild.members.cache;
    const resultTestChannelId = '1003470340481101906';
    const balanceList = [];
    const sheetId = '337748561';
    const sheetName = 'balance';
    const balanceRequests = [];
    const balanceData = [];
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

    for (const member of members) {
      const userId = member[1].user.id;
      const profile = await Profile.find({
        UserID: userId,
        GuildID: guildId,
      });
      if (profile.length) {
        const value = [
          member[1].user.username,
          userId,
          `${profile[0].Wallet} SBT`,
          `${profile[0].Bank} SBT`,
        ];
        balanceList.push(value);
      }
    }
    const balanceLength = balanceList.length;

    balanceData.push({
      range: `${sheetName}!A${startRowIndex + 1}:D${balanceLength + 1}`,
      values: balanceList,
    });

    balanceData.push({
      range: `${sheetName}!A${balanceLength + 2}:D${balanceLength + 3}`,
      values: [['Total', balanceLength, '', '']],
    });

    balanceRequests.push({
      repeatCell: {
        range: {
          sheetId: sheetId,
          startRowIndex: balanceLength + 1,
          endRowIndex: balanceLength + 2,
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

    await postResultGoogleSheet(
      sheetId,
      sheetName,
      balanceRequests,
      balanceData
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
