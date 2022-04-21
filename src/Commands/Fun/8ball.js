const { MessageEmbed } = require('discord.js');

module.exports = {
  name: '8ball',
  description: 'Ask the magic ball a question.',
  options: [
    {
      name: 'question',
      description: 'The question you want to ask.',
      required: true,
      type: 'STRING'
    }
  ],
  category: 'Fun',
  async run({ interaction, bot }) {
    const answers = [
      'It is certain',
      'It is decidedly so',
      'Without a doubt',
      'Yes, definitely',
      'You may rely on it',
      'As I see it, yes',
      'Most likely',
      'Outlook good',
      'Yes',
      'Signs point to yes',
      'Reply hazy try again',
      'Ask again later',
      'Better not tell you now',
      'Cannot predict now',
      'Concentrate and ask again',
      "Don't count on it",
      'My reply is no',
      'My sources say no',
      'Outlook not so good',
      'Very doubtful'
    ];

    interaction.reply({
      embeds: [
        new MessageEmbed()
          .setColor('BLURPLE')
          .addField(`Your question:`, interaction.options.getString('question'))
          .addField(`My answer:`, answers[Math.floor(Math.random() * answers.length)])
      ]
    });
  }
};
