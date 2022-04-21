const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'minecraftadvancement',
  description: "Create an custom Minecraft 'Advancement Made' image.",
  category: 'Image',
  options: [
    {
      name: 'text',
      description: 'Provide an advancement text.',
      required: true,
      type: 'STRING'
    },
    {
      name: 'object',
      type: 'STRING',
      description: 'Select what object you want to be displayed',
      required: true,
      choices: [
        {
          name: 'Stone Block',
          value: 'stone'
        },
        {
          name: 'Grass Block',
          value: 'grass'
        },
        {
          name: 'Crafting Table',
          value: 'craftingtable'
        },
        {
          name: 'Furnace',
          value: 'furnace'
        },
        {
          name: 'Coal',
          value: 'coal'
        },
        {
          name: 'Iron Ingot',
          value: 'iron'
        },
        {
          name: 'Gold Ingot',
          value: 'gold'
        },
        {
          name: 'Diamond',
          value: 'diamond'
        },
        {
          name: 'Redstone Dust',
          value: 'redstone'
        },
        {
          name: 'Diamond Sword',
          value: 'diamond-sword'
        },
        {
          name: 'TNT',
          value: 'tnt'
        },
        {
          name: 'Cookie',
          value: 'cookie'
        },
        {
          name: 'Cake',
          value: 'cake'
        },
        {
          name: 'Creeper Head',
          value: 'creeper'
        },
        {
          name: 'Pig Head',
          value: 'pig'
        },
        {
          name: 'Heart',
          value: 'heart'
        }
      ]
    }
  ],

  async run({ interaction, bot }) {
    const text = interaction.options.getString('text').split(' ').join('+');

    let link;
    if (interaction.options.get('object').value === 'stone')
      link = `https://minecraftskinstealer.com/achievement/20/Advancement+Made!/${text}`;
    if (interaction.options.get('object').value === 'grass')
      link = `https://minecraftskinstealer.com/achievement/1/Advancement+Made!/${text}`;
    if (interaction.options.get('object').value === 'craftingtable')
      link = `https://minecraftskinstealer.com/achievement/13/Advancement+Made!/${text}`;
    if (interaction.options.get('object').value === 'furnace')
      link = `https://minecraftskinstealer.com/achievement/18/Advancement+Made!/${text}`;
    if (interaction.options.get('object').value === 'coal')
      link = `https://minecraftskinstealer.com/achievement/31/Advancement+Made!/${text}`;
    if (interaction.options.get('object').value === 'iron')
      link = `https://minecraftskinstealer.com/achievement/22/Advancement+Made!/${text}`;
    if (interaction.options.get('object').value === 'gold')
      link = `https://minecraftskinstealer.com/achievement/23/Advancement+Made!/${text}`;
    if (interaction.options.get('object').value === 'diamond')
      link = `https://minecraftskinstealer.com/achievement/2/Advancement+Made!/${text}`;
    if (interaction.options.get('object').value === 'redstone')
      link = `https://minecraftskinstealer.com/achievement/14/Advancement+Made!/${text}`;
    if (interaction.options.get('object').value === 'diamond-sword')
      link = `https://minecraftskinstealer.com/achievement/3/Advancement+Made!/${text}`;
    if (interaction.options.get('object').value === 'tnt')
      link = `https://minecraftskinstealer.com/achievement/6/Advancement+Made!/${text}`;
    if (interaction.options.get('object').value === 'cookie')
      link = `https://minecraftskinstealer.com/achievement/7/Advancement+Made!/${text}`;
    if (interaction.options.get('object').value === 'cake')
      link = `https://minecraftskinstealer.com/achievement/10/Advancement+Made!/${text}`;
    if (interaction.options.get('object').value === 'creeper')
      link = `https://minecraftskinstealer.com/achievement/4/Advancement+Made!/${text}`;
    if (interaction.options.get('object').value === 'pig')
      link = `https://minecraftskinstealer.com/achievement/5/Advancement+Made!/${text}`;
    if (interaction.options.get('object').value === 'heart')
      link = `https://minecraftskinstealer.com/achievement/8/Advancement+Made!/${text}`;

    interaction.reply({
      embeds: [new MessageEmbed().setColor('BLURPLE').setImage(link)]
    });
  }
};
