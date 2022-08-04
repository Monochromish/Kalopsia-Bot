const {
  MessageEmbed,
  Modal,
  TextInputComponent,
  MessageActionRow,
} = require('discord.js');
const structureConfig = require('../../Structures/Config');
const guildId = structureConfig.guildOnly.guildID;
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);
const Profile = require('../../Models/Profile');

module.exports = {
  name: 'buy',
  description: `buy goods by your SBT token!`,
  options: [
    {
      name: 'number',
      description: 'insert goods number',
      required: true,
      type: 'NUMBER',
    },
  ],
  type: 'COMMAND',
  async run({ interaction, bot }) {
    const goodsNumber = interaction.options.getNumber('number');
    const goodsList = db.get('goodsList').value();
    const goods = goodsList.find((goods) => goods.id === goodsNumber);
    const guild = await bot.guilds.cache.get(guildId);
    const userId = interaction.user.id;
    const profile = await Profile.find({ UserID: userId, GuildID: guild.id });

    //temp
    const testChannelId = '991544787184390144';

    if (interaction.channelId !== testChannelId) {
      await interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor('RED')
            .setDescription('Run this command in result-test channel'),
        ],
      });
      return;
    }

    if (!profile.length) {
      await interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor('RED')
            .setDescription(`You don't have profile. Make a profile first.`),
        ],
      });
    } else if (!goods) {
      await interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor('RED')
            .setDescription(
              'You entered the wrong goods number. Please enter it again'
            ),
        ],
      });
    } else if (profile[0].Wallet < goods.price) {
      await interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor('RED')
            .setDescription(
              `You can't buy this goods because you don't have enough money`
            ),
        ],
      });
    } else {
      const nameInput = new TextInputComponent()
        .setCustomId(`NameInput`)
        .setLabel(`What's your name?`)
        .setStyle(1)
        .setMaxLength(5)
        .setRequired(true);

      const addressInput = new TextInputComponent()
        .setCustomId(`addressInput`)
        .setLabel(`What's your address?`)
        .setStyle(1)
        .setMaxLength(100)
        .setRequired(true);
      const phoneNumberInput = new TextInputComponent()
        .setCustomId('phoneNumberInput')
        .setLabel(`What's your phone number?`)
        .setStyle(1)
        .setMaxLength(12)
        .setRequired(true);
      const nameActionRow = new MessageActionRow().addComponents(nameInput);
      const addressActionRow = new MessageActionRow().addComponents(
        addressInput
      );
      const phoneNumberActionRow = new MessageActionRow().addComponents(
        phoneNumberInput
      );
      const components = [
        nameActionRow,
        addressActionRow,
        phoneNumberActionRow,
      ];
      if (goods.size) {
        const sizeOptions = goods.size.join(', ');
        const sizeInput = new TextInputComponent()
          .setCustomId('SizeInput')
          .setLabel(`What's your size? (${sizeOptions})`)
          .setStyle(1)
          .setMaxLength(10)
          .setRequired(true);
        const sizeActionRow = new MessageActionRow().addComponents(sizeInput);
        components.push(sizeActionRow);
      }
      const modal = new Modal()
        .setCustomId(`orderInformationNumber${goodsNumber}Price${goods.price}`)
        .setTitle('Order Information')
        .addComponents(components);

      await interaction.showModal(modal);
    }
  },
};
