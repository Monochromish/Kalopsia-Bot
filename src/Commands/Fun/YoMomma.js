const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  name: 'yomomma',
  description: 'Sends a YoMomma joke. [insert yomomma joke]',
  options: [
    {
      name: 'user',
      description: 'Mention someone.',
      required: false,
      type: 'USER'
    }
  ],
  category: 'Fun',
  async run({ interaction, bot }) {
    const member = interaction.options.getMember('user') || interaction.member;
    const res = await fetch('https://api.yomomma.info');
    let joke = (await res.json()).joke;
    joke = joke.charAt(0).toLowerCase() + joke.slice(1);
    if (!joke.endsWith('!') && !joke.endsWith('.') && !joke.endsWith('"')) joke += '!';

    interaction.reply({ embeds: [new MessageEmbed().setDescription(`${member}, ${joke}`).setColor('BLURPLE')] });
  }
};
