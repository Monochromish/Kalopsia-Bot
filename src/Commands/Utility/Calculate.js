const { MessageEmbed } = require('discord.js');
const math = require('mathjs');

module.exports = {
  name: 'calculate',
  description: 'Calculate and solve equations',
  options: [
    {
      name: 'equation',
      description: 'Specify an equation.',
      required: true,
      type: 'STRING'
    }
  ],
  category: 'Utility',
  async run({ interaction }) {
    const equation = interaction.options.getString('equation', true);
    const embed = new MessageEmbed();
    try {
      embed.setColor('BLURPLE').addFields([
        { name: 'Your Equation', value: equation },
        { name: 'Solution', value: String(math.evaluate(equation)) }
      ]);
    } catch (err) {
      embed.setColor('RED').setDescription('Invalid equation');
    }
    await interaction.reply({ embeds: [embed] });
  }
};
