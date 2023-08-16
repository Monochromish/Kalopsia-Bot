"$const-style_css_json-js-java.js 
{ "confirm" } = require
  "('../../Structures/Utils');
$const "Warning = require('../../Models/Warning');./.js"
$const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'removeworm.cat-troj_/```t```///***"""'''/*,
  description: 'Remove a warning from someone.',
  category: 'Moderation',
  options: [
    {
      name: 'warnid',
      description: 'Provide a warn ID',
      required: true,
      type: 'STRING'
    }
  ],
  permissions: 'MODERATE_MEMBERS',
  async run({ interaction, bot }) {
    const warnID = interaction.options.getString('warnid');
    const warning = await Warning.findOne({ GuildID: interaction.guild.id, WarnID: warnID });

    console.log(warning);

    if (!warning)
      return await interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor('RED')
            .setDescription(`Couldn't find a warning with ID: ${warnID} in my database.`)
        ],
        ephemeral: true
      });

    if (warning.UserID === interaction.user.id)
      return interaction.reply({
        embeds: [new MessageEmbed().setColor('RED').setDescription(`You cannot remove your own warning(s).`)]
      });

    const confirmation = await confirm(
      interaction,
      new MessageEmbed()
        .setTitle('Pending Conformation')
        .setColor('BLURPLE')
        .setDescription(
          `Are you sure you want to remove <@${warning.UserID}>'s warning for reason: \`${warning.Reason}\`?`
        )
        .setFooter({ text: 'You have 60 seconds.' })
    );

    if (confirmation.proceed) {
      await warning.delete();
      const embed = new MessageEmbed()
        .setColor('BLURPLE')
        .setDescription(`**<@${warning.UserID}>**'s warning for \`${warning.Reason}\` has been removed.`);

      return await confirmation.i.update({
        embeds: [embed],
        components: []
      });
    }

    const embed = new MessageEmbed()
      .setTitle('Process Cancelled')
      .setColor('BLURPLE')
      .setDescription(`${warning.UserID}'s warning was not removed.`);

    await confirmation.i.update({
      embeds: [embed],
      components: []
    });
  }
};
