const { MessageEmbed } = require('discord.js');
module.exports = {
  name: 'bmi',
  description: 'Calculate your BMI Index.',
  options: [
    {
      name: 'weight',
      description: 'Provide your weight in kilograms.',
      required: true,
      type: 'INTEGER'
    },
    {
      name: 'height',
      description: 'Provide your height in centimeters.',
      required: true,
      type: 'INTEGER'
    }
  ],
  category: 'Utility',
  async run({ interaction, bot }) {
    try {
      const weight = interaction.options.getInteger('weight');
      const height = interaction.options.getInteger('height');
      if (weight < 50 || weight > 600)
        return interaction.reply('Weight cannot be less than 50 kilograms or cannot exceed 600 kilograms.');
      if (height < 50 || height > 275)
        return interaction.reply('Height cannot be less than 50 centimeters or more than 275 meters.');
      const bmi = (weight / ((height * height) / 10000)).toFixed(2);
      let category;
      if (bmi < 18.5) category = 'Underweight';
      if (bmi > 24.9) category = 'Overweight';
      if (bmi > 30) category = 'Obesity';
      if (bmi < 24.9 && bmi > 18.5) category = 'Normal';
      interaction.reply({
        embeds: [
          new MessageEmbed()
            .addField('Weight', `${weight}`, true)
            .addField('Height', `${height}`, true)
            .addField('BMI', `${bmi}`, true)
            .addField('Category', `${category}`, true)
            .setColor('BLURPLE')
        ]
      });
    } catch (err) {
      interaction.reply('Invalid values were provided.');
    }
  }
};
