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

//temp
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
    const merchNumber = interaction.options.getNumber('number');
    const merchList = db.get('merchList').value();
    const merch = merchList.find((merch) => merch.id === merchNumber);
    const { size: merchSize, price: merchPrice } = merch;

    //temp
    // const userId = interaction.user.id;
    // const guild = await bot.guilds.cache.get(guildId);
    // await Profile.updateOne(
    //   { UserID: userId, GuildID: guild.id },
    //   { $inc: { Wallet: +100 } }
    // );

    if (!merch) {
      await interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor('RED')
            .setDescription(
              'You entered the wrong goods number. Please enter it again'
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
      const countInput = new TextInputComponent()
        .setCustomId(`CountInput`)
        .setLabel(`Write goods's count`)
        .setStyle(1)
        .setMaxLength(5)
        .setRequired(true);
      const nameActionRow = new MessageActionRow().addComponents(nameInput);
      const addressActionRow = new MessageActionRow().addComponents(
        addressInput
      );
      const phoneNumberActionRow = new MessageActionRow().addComponents(
        phoneNumberInput
      );
      const countActionRow = new MessageActionRow().addComponents(countInput);
      const components = [
        nameActionRow,
        addressActionRow,
        phoneNumberActionRow,
        countActionRow,
      ];
      if (merchSize) {
        const sizeOptions = merchSize.join(', ');
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
        .setCustomId(`orderInformationNumber${merchNumber}Price${merchPrice}`)
        .setTitle('Order Information')
        .addComponents(components);

      await interaction.showModal(modal);
    }
  },
};
