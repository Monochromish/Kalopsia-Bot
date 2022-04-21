const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'lift-lockdown',
  description: 'Lift a server lockdown.',
  category: 'Moderation',
  permissions: 'MANAGE_CHANNELS',
  async run({ interaction, bot, guild }) {
    /*
		If you have a main role;
		put it below as await guild.roles.fetch('id')
		remove sending permissions from @everyone
		same for lockdown
		*/

    await guild.roles.everyone.setPermissions(guild.roles.everyone.permissions.add('SEND_MESSAGES'));

    await interaction.reply({
      embeds: [new MessageEmbed().setColor('BLURPLE').setDescription(`Lockdown lifted.`)]
    });
  }
};
