const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const regex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
module.exports = {
  name: 'color',
  description: 'Displays information about specified color.',
  options: [
    {
      name: 'hex',
      description: 'Provide a hexadecimal color code.',
      required: true,
      type: 'STRING'
    }
  ],
  category: 'Utility',
  async run({ interaction, bot }) {
    let hex;
    hex = interaction.options.getString('hex');
    if (!hex) return interaction.reply('Invalid Syntax\nProvide a hexadecimal color code.');
    if (!hex.startsWith('#')) hex = '#' + hex; // Hardcoded because I suck at code. ;-;
    if (regex.test(hex)) {
      const color = hex.replace('#', '');
      const response = await fetch(`https://api.alexflipnote.dev/colour/${color}`);
      await response.json().then(res => {
        interaction.reply({
          embeds: [
            new MessageEmbed()
              .setTitle(`Closest color match 〢 ${res.name}`)
              .setURL(`https://www.color-hex.com/color/${color}`)
              .setThumbnail(res.image)
              .setImage(res.image_gradient)
              .setColor(res.hex)
              .addField('Hex', `${res.hex}`, true)
              .addField('RGB', `${res.rgb}`, true)
          ]
        });
      });
    } else {
      interaction.reply('Provide a valid hexadecimal color code.');
    }
  }
};
