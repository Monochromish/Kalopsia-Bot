const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  name: 'advice',
  description: 'Sends a random advice',
  category: 'Fun',
  async run({ interaction, bot }) {
    const data = await fetch('https://api.adviceslip.com/advice').then(res => res.json());

    interaction.reply({
      embeds: [new MessageEmbed().setTitle('Advice').setDescription(data.slip.advice).setColor('BLURPLE')]
    });
  }
};
