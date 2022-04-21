const { MessageEmbed } = require('discord.js');
module.exports = {
  name: 'serverinfo',
  description: 'Displays various information about server',
  category: 'Utility',
  async run({ interaction, bot, guild }) {
    const owner = await guild.fetchOwner();
    const channels = await guild.channels.fetch();
    await interaction.reply({
      embeds: [
        new MessageEmbed()
          .setColor('BLURPLE')
          .setAuthor({
            name: guild.name,
            iconURL: guild.iconURL() || 'https://i.pinimg.com/736x/35/79/3b/35793b67607923a68d813a72185284fe.jpg'
          })
          .setThumbnail(guild.iconURL() || 'https://i.pinimg.com/736x/35/79/3b/35793b67607923a68d813a72185284fe.jpg')
          .addField('Server Creation', `<t:${Math.round(guild.createdTimestamp / 1000)}:f>`, false)
          .addField('Owner', `${owner}`, false)
          .addField('Total Members', `${guild.memberCount}`, false)
          .addField('Total Channels', `${channels.size}`, false)
          .setFooter({
            text: `Guild ID: ${guild.id}`
          })
      ]
    });
  }
};
