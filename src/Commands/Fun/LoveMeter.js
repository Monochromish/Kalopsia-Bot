const { MessageEmbed } = require('discord.js');
module.exports = {
  name: 'lovemeter',
  description: 'Displays love meter between two users.',
  options: [
    {
      name: 'user',
      description: 'Mention user.',
      required: true,
      type: 'USER'
    },
    {
      name: 'user2',
      description: 'Mention user.',
      required: false,
      type: 'USER'
    }
  ],
  category: 'Utility',
  async run({ interaction, bot }) {
    const user = interaction.options.getMember('user');
    const user2 = interaction.options.getMember('user2') || interaction.member;
    if (user.id === user2.id)
      return interaction.editReply('I can only calculate love percentage between two different people.');

    const love = Math.random() * 100;
    const loveIndex = Math.floor(love / 10);
    const loveLevel = '❤️'.repeat(loveIndex) + '♡'.repeat(10 - loveIndex);

    interaction.reply({
      embeds: [
        new MessageEmbed()
          .setColor('BLURPLE')
          .addField(`${user.displayName} and ${user2.displayName}`, `${Math.floor(love)}%: \`${loveLevel}\``, true)
      ]
    });
  }
};
