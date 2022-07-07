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
const Config = require('./Config');
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
    const buttons = [
      // 각 버튼을 배열(array) 자료구조로 만들어요
      {
        customId: 'bluechipButton',
        label: 'Bluechip 투표하기',
        style: 'PRIMARY',
        async action(interaction) {
          // console.log('sendButton!', { interaction });
          // const message = await interaction.message.fetch();
          // console.log('meesage:::::', message.interaction);

          const selectBluechipNFTRow = new MessageActionRow().addComponents(
            new MessageSelectMenu()
              .setCustomId('selectBluechip')
              .setPlaceholder('select Bluechip NFT')
              .addOptions([
                {
                  label: 'BAYC',
                  description: 'Bored Ape Yacht Club',
                  value: 'BAYC',
                },
                {
                  label: 'DOODLES',
                  description: 'Doodles',
                  value: 'DOODLES',
                },
                {
                  label: 'CLONEX',
                  description: 'CloneX',
                  value: 'CLONEX',
                },
              ])
          );
          await interaction.reply({
            components: [selectBluechipNFTRow],
            ephemeral: true,
          });
        },
      },
      {
        customId: 'risingButton',
        label: 'Rising 투표하기',
        style: 'PRIMARY',
        async action(interaction) {
          const selectRisingNFTRow = new MessageActionRow().addComponents(
            new MessageSelectMenu()
              .setCustomId('selectRising')
              .setPlaceholder('select Rising NFT')
              .addOptions([
                {
                  label: 'BAYC',
                  description: 'Bored Ape Yacht Club',
                  value: 'BAYC',
                },
                {
                  label: 'DOODLES',
                  description: 'Doodles',
                  value: 'DOODLES',
                },
                {
                  label: 'CLONEX',
                  description: 'CloneX',
                  value: 'CLONEX',
                },
              ])
          );
          await interaction.reply({
            components: [selectRisingNFTRow],
            ephemeral: true,
          });
        },
      },
    ];

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
      const { Client } = require('@notionhq/client');
      const notion = new Client({
        auth: process.env.NOTION_ACCESS_TOKEN,
      });
      try {
        const databaseGeneralId = Config.notionAPI.general;
        const response = await notion.databases.query({
          database_id: databaseGeneralId,
        });
        console.log(response);
      } catch (error) {
        console.error(error);
      }

      const messages = await interaction.channel.messages.fetch();
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

        // await interaction.reply({
        //   content: `${interaction.values[0]}에 투표하셨습니다.`,
        //   ephemeral: true,
        // });
        const voteData = {
          target: interaction.customId,
          id: interaction.user.id,
          username: interaction.user.username,
          value: interaction.values[0],
        };
        console.log({ voteData });
        return;
      }
      if (interaction.isButton()) {
        const button = buttons.find(
          (button) => button.customId === interaction.customId
        );
        await button.action(interaction);
      }
    });
    // 버튼 이벤트 종료 (여기에서는 시간초과)가 됐을때, 뭘 할지 정의
    collector.on('end', async (collect) => {});
  },
};
