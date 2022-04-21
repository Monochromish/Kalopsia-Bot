const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'ping',
  description: "Shows bot's ping; pong.",
  category: 'Info',
  async run({ interaction, bot }) {
    const message = await interaction.reply({
      embeds: [
        new MessageEmbed()
          .setAuthor({
            name: 'Please wait...',
            iconURL: 'https://acegif.com/wp-content/uploads/loading-42.gif'
          })
          .setColor('BLURPLE')
      ],
      fetchReply: true
    });
    await interaction.editReply({
      embeds: [
        new MessageEmbed()
          .setColor('BLURPLE')
          .addField('API Pong', `${Math.round(bot.ws.ping)} ms`)
          .addField('Latency', `${message.createdTimestamp - Date.now()}`)
          .addField('Uptime', `<t:${(Date.now() / 1000 - bot.uptime / 1000).toFixed(0)}:R>`, false)
      ]
    });
  }
};
