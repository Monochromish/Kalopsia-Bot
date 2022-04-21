const Warning = require('../../Models/Warning');
const { MessageEmbed } = require('discord.js');
const Menu = require('../../Structures/Menu');

module.exports = {
  name: 'warnings',
  description: 'View warnings for a user.',
  category: 'Moderation',
  options: [
    {
      name: 'user',
      description: 'The user to get warnings of',
      type: 'USER',
      required: false
    }
  ],
  permissions: 'MANAGE_MESSAGES',
  async run({ interaction, options, bot, guild }) {
    const user = options.getUser('user') || interaction.user;

    const warnings = await Warning.find({ UserID: user.id, GuildID: guild.id });
    if (!warnings.length)
      return await interaction.reply({
        embeds: [new MessageEmbed().setColor('RED').setDescription(`${user} doesn't have any warning.`)]
      });

    const menu = new Menu(bot, interaction, {
      embed: new MessageEmbed()
        .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
        .setColor('BLURPLE')
        .setFooter({ text: guild.name, iconURL: guild.iconURL() }),
      pages: warnings.map(warning => {
        return `
				**Moderator:** <@${warning.Moderator}> [\`${warning.Moderator}\`]
				**Warning ID:** ${warning.WarnID}
				**Reason:** ${warning.Reason}
				`;
      })
    });

    await menu.start();
  }
};
