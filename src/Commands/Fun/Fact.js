const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
module.exports = {
  name: 'fact',
  description: 'Sends a random useless fact.',
  category: 'Fun',
  async run({ interaction, bot }) {
    const response = await fetch('https://uselessfacts.jsph.pl/random.json?language=en');
    await response.json().then(res => {
      interaction.reply({
        embeds: [new MessageEmbed().setTitle('Fact').setDescription(res.text).setColor('BLURPLE')]
      });
    });
  }
};
