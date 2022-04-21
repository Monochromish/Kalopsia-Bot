const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  name: 'boobs',
  description: 'Sends boobs image.',
  category: 'NSFW',
  options: [
    {
      name: 'type',
      type: 'STRING',
      description: 'Pick your poison.',
      required: false,
      choices: [
        {
          name: 'Real life',
          value: 'rl'
        },
        {
          name: 'Hentai',
          value: 'h'
        }
      ]
    }
  ],
  async run({ interaction, bot }) {
    var category;
    if (!interaction.options.get('type') || interaction.options.get('type')?.value === 'rl') {
      category = 'boobs';
    } else {
      category = 'hboobs';
    }
    const res = await fetch(`https://nekobot.xyz/api/image?type=${category}`);
    const json = await res.json();
    const embed = new MessageEmbed().setColor('BLURPLE').setImage(json.message);
    await interaction.reply({ embeds: [embed] });
  }
};
