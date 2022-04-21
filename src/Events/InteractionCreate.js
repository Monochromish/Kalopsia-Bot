const { MessageEmbed } = require('discord.js');
module.exports = {
  event: 'interactionCreate',
  async run(bot, interaction) {
    if (!interaction.isCommand()) return;

    const command = bot.commands.get(interaction.commandName);
    if (!command) return;

    if (command.permission && !interaction.member.permissions.has(command.permission)) {
      return await interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor('RED')
            .setDescription(`You require the \`${command.permission}\` to run this command.`)
        ]
      });
    } else {
      // If command's category is `NSFW` and if interaction.channel.nsfw is false, inform them to use the command in nsfw enabled channel.
      if (command.category === 'NSFW' && !interaction.channel.nsfw) {
        await interaction[interaction.deferred ? 'editReply' : interaction.replied ? 'followUp' : 'reply']({
          embeds: [
            new MessageEmbed()
              .setColor('RED')
              .setDescription('You can use this command in Age-Restricted/NSFW enabled channels only.')
              .setImage('https://i.imgur.com/oe4iK5i.gif')
          ],
          ephemeral: true
        });
      } else {
        try {
          await command.run({ interaction, bot, options: interaction.options, guild: interaction.guild });
        } catch (err) {
          console.log(err);

          await interaction[interaction.deferred ? 'editReply' : interaction.replied ? 'followUp' : 'reply']({
            embeds: [new MessageEmbed().setColor('RED').setDescription(err.message || 'Unexpected error')]
          });
        }
      }
    }
  }
};
