const { SlashCommandBuilder } = require('@discordjs/builders');
const {
  MessageActionRow,
  MessageButton,
  MessageSelectMenu,
  MessageEmbed,
} = require('discord.js');

const Profile = require('../../Models/Profile');
const { createProfile } = require('../../Structures/Utils');
require('dotenv').config();
const Config = require('../../Config');
const R = require('ramda');
const request = require('../../Structures/Request');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);

module.exports = {
  name: 'vote',
  description: 'NFT 투표 시작/종료!',
  options: [
    {
      name: 'option',
      value: 'poll_start',
      description: '시작',
      required: true,
      type: 'STRING',
      choices: [
        { name: 'start', value: 'poll_start' },
        { name: 'end', value: 'poll_end' },
      ],
    },
  ],
  permissions: 'ADMINISTRATOR',
  type: 'COMMAND',
  run: async ({ interaction, options, bot, guild }) => {
    // console.log(interaction);
    if (!interaction.isCommand()) return;

    // filter : 버튼에 지정된 customId만 message collector가 동작할 수 있게 함
    const filter = (i) => {
      return i.user.id === interaction.user.id;
    };

    // collector : discord.js component event를 수집하는 객체
    const collector = interaction.channel.createMessageComponentCollector({
      // filter,
      // time: 60 * 3000, // 몇초동안 반응할 수 있는지, ms단위라서 3초면 3000으로 입력
    });

    if (interaction.options.get('option').value === 'poll_start') {
      const messages = await interaction.channel.messages.fetch();

      //투표가 정상적으로 종료되었을경우, 아직 시작하지 않았을 경우에는 GoogleSheet에서 값을 fetch
      //그 외(기타 명령어시 데이터, 비정상 종료 후 재시작)는 lowdb에서 긁어온다.

      //lowdb에서 현재 투표 상태를 읽어옴
      const isVoting = db.get('voteStatus').value().isVoting;
      console.log('db::isVoting', isVoting);
      //isVoting: false - 정상 / true - 비정상
      if (
        isVoting &&
        db.get('bluechipList').value()?.length > 0 &&
        db.get('risingList').value()?.length > 0
      ) {
        //비정상종료된 voting
        //fetch lowdb
      } else {
        //fetch googleSheet
        const apiKey = process.env.GOOGLE_ACCESS_TOKEN;
        const spreadsheetId = Config.google.databaseKey;
        const sheetName = ['general', 'bluechip', 'rising'];
        try {
          const response = await request({
            method: 'GET',
            url: `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName[0]}?key=${apiKey}`,
            json: true,
            maskResponse: ({ Data, ...rest }, mask) => ({
              ...rest,
              Data: mask,
            }),
          });
          db.get('voteStatus')
            .assign({
              isVoting: true,
              voteId: response.values[1][0],
              voteTitle: response.values[1][1],
            })
            .write();
        } catch (error) {
          console.error(error);
        }
        try {
          const response = await request({
            method: 'GET',
            url: `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName[1]}?key=${apiKey}`,
            json: true,
            maskResponse: ({ Data, ...rest }, mask) => ({
              ...rest,
              Data: mask,
            }),
          });
          console.log(response.values);
          const bluechipList = [];
          response.values.slice(1).forEach((e) => {
            bluechipList.push({ name: e[0], id: e[1] });
          });
          db.get('bluechipList').remove().write();
          db.get('bluechipList').assign(bluechipList).write();
        } catch (error) {
          console.error(error);
        }
        try {
          const response = await request({
            method: 'GET',
            url: `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName[2]}?key=${apiKey}`,
            json: true,
            maskResponse: ({ Data, ...rest }, mask) => ({
              ...rest,
              Data: mask,
            }),
          });
          console.log(response.values);
          const risingList = [];
          response.values.slice(1).forEach((e) => {
            risingList.push({ name: e[0], id: e[1] });
          });
          db.get('risingList').remove().write();
          db.get('risingList').assign(risingList).write();
        } catch (error) {
          console.error(error);
        }
      }
      // const bluechipList = db.get('bluechipList').value();
      // const risingList = db.get('risingList').value();
      const buttons = [
        // 각 버튼을 배열(array) 자료구조로 만들어요
        {
          customId: 'bluechipButton',
          label: 'Bluechip 투표하기',
          style: 'PRIMARY',
        },
        {
          customId: 'risingButton',
          label: 'Rising 투표하기',
          style: 'PRIMARY',
        },
      ];

      // console.log({ messages });
      messages.forEach((value, key, object) => {
        //이전 투표 명령어 메시지를 다 삭제
        try {
          if (value.interaction.commandName === '투표')
            value.edit({ components: [] });
        } catch (error) {}
      });
      const buttonRow = new MessageActionRow().addComponents(
        // buttons array를 하나씩 읽어서 버튼을 만들게 됩니다
        buttons.map((button) => {
          return new MessageButton()
            .setCustomId(button.customId)
            .setLabel(button.label)
            .setStyle(button.style);
        })
      );
      const embed = new MessageEmbed().setTitle(
        `Choose your Favorite NFT!
        1. Bluechip
        2. Rising
        `
      );

      // 디스코드에 출력하는 코드
      const message = `STARBOYS☝️ FAVORITE NFT CHALENGE!`;
      await interaction.reply({
        content: message,
        components: [buttonRow],
        embeds: [embed],
      });
    } else if (interaction.options.get('option').value === 'poll_end') {
      collector.stop();

      const messages = await interaction.channel.messages.fetch();
      // console.log({ messages });
      messages.forEach((value, key, object) => {
        //이전 투표 명령어 메시지를 다 삭제
        try {
          if (value.interaction.commandName === '투표')
            value.edit({ components: [] });
        } catch (error) {}
      });

      await interaction.reply(`투표가 종료되었습니다.`);
      db.get('voteStatus')
        .assign({
          isVoting: false,
        })
        .write();
    }
    collector.on('collect', async (interaction) => {
      // 배열(buttons array)에 있는 동작을 자동으로 읽음
      if (
        interaction.isSelectMenu() &&
        (interaction.customId === 'selectBluechip' ||
          interaction.customId === 'selectRising')
      ) {
        const profile = await Profile.find({
          UserID: interaction.user.id,
          GuildID: guild.id,
        });
        if (!profile.length) {
          await createProfile(interaction.user, guild);
          await interaction.reply({
            embeds: [
              new MessageEmbed().setColor('BLURPLE').setDescription(
                `Creating profile.\n
                You will have collected Voting Participation Rewards (10€).\n
                ${interaction.values[0]}에 투표하셨습니다.`
              ),
            ],
          });
        } else {
          await interaction.reply({
            embeds: [
              new MessageEmbed()
                .setColor('BLURPLE')
                .setTitle(`${interaction.user.username}'s Earning`)
                .setDescription(
                  `You will have collected Voting Participation Rewards (10€).\n
                  ${interaction.values[0]}에 투표하셨습니다.`
                ),
            ],
          });
        }
        const voteData = {
          target: interaction.customId,
          id: interaction.user.id,
          username: interaction.user.username,
          value: interaction.values[0],
        };
        console.log({ voteData });

        if (!db.get('voteUser').find({ id: interaction.user.id }).value()) {
          db.get('voteUser')
            .push({
              id: interaction.user.id,
              userName: interaction.user.username,
              bluechipChoice: '',
              risingChoice: '',
            })
            .write();
        }

        if (interaction.customId === 'selectBluechip') {
          db.get('voteUser')
            .find({ id: interaction.user.id })
            .assign({
              id: interaction.user.id,
              userName: interaction.user.username,
              bluechipChoice: interaction.values[0],
            })
            .write();
        } else if (interaction.customId === 'selectRising') {
          db.get('voteUser')
            .find({ id: interaction.user.id })
            .assign({
              id: interaction.user.id,
              userName: interaction.user.username,
              risingChoice: interaction.values[0],
            })
            .write();
        }

        return;
      }
      if (interaction.isButton()) {
        if (interaction.customId === 'bluechipButton') {
          const bluechipList = db.get('bluechipList').value();

          const selectBluechipNFTRow = new MessageActionRow().addComponents(
            new MessageSelectMenu()
              .setCustomId('selectBluechip')
              .setPlaceholder('select Bluechip NFT')
              .addOptions(
                bluechipList.map((e) => ({
                  label: e.name,
                  description: e.name,
                  value: e.name,
                }))
              )
          );

          await interaction.reply({
            components: [selectBluechipNFTRow],
            ephemeral: true,
          });
        } else if (interaction.customId === 'risingButton') {
          const risingList = db.get('risingList').value();
          const selectRisingNFTRow = new MessageActionRow().addComponents(
            new MessageSelectMenu()
              .setCustomId('selectRising')
              .setPlaceholder('select Rising NFT')
              .addOptions(
                risingList.map((e) => ({
                  label: e.name,
                  description: e.name,
                  value: e.name,
                  address: e.id,
                }))
              )
          );
          await interaction.reply({
            components: [selectRisingNFTRow],
            ephemeral: true,
          });
        }
      }
    });
    // 버튼 이벤트 종료 (여기에서는 시간초과)가 됐을때, 뭘 할지 정의
    collector.on('end', async (collect) => {});
  },
};
