const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  name: 'hentai',
  description: 'Sends hentai.',
  category: 'NSFW',
  async run({ interaction, bot }) {
    const res = await fetch(`https://nekobot.xyz/api/image?type=hentai`);
    const json = await res.json();
    const embed = new MessageEmbed().setColor('BLURPLE').setImage(json.message);
    await interaction.reply({ embeds: [embed] });
  }
};
