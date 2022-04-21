const { MessageEmbed } = require('discord.js');
module.exports = {
  name: 'avatar',
  description: "Displays user's avatar",
  options: [
    {
      name: 'user',
      description: 'Mention user.',
      required: false,
      type: 'USER'
    }
  ],
  category: 'Utility',
  async run({ interaction, bot }) {
    const user = interaction.options.getMember('user') || interaction.member;
    await user.user.fetch(true);
    await interaction.reply({
      embeds: [
        new MessageEmbed()
          .setColor('BLURPLE')
          .setImage(
            user.displayAvatarURL({ dynamic: true }) ||
              'https://i.pinimg.com/736x/35/79/3b/35793b67607923a68d813a72185284fe.jpg'
          )
      ]
    });
  }
};
