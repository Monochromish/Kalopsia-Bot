const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  name: 'pussy',
  description: 'Sends pussy image.',
  category: 'NSFW',
  async run({ interaction, bot }) {
    const res = await fetch(`https://nekobot.xyz/api/image?type=pussy`);
    const json = await res.json();
    const embed = new MessageEmbed().setColor('BLURPLE').setImage(json.message);
    await interaction.reply({ embeds: [embed] });
  }
};
