const { getRandomString, confirm } = require('../../Structures/Utils');
const Warning = require('../../Models/Warning');
const { time } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'warn',
  description: 'Warn someone.',
  category: 'Moderation',
  options: [
    {
      name: 'user',
      description: 'Mention a user',
      required: true,
      type: 'USER'
    },
    {
      name: 'reason',
      description: 'Specify reason for warn',
      required: true,
      type: 'STRING'
    }
  ],
  permissions: 'MODERATE_MEMBERS',
  async run({ interaction, bot }) {
    const member = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason');

    if (member.id === interaction.user.id)
      return interaction.reply({
        embeds: [new MessageEmbed().setColor('RED').setDescription(`You cannot warn yourself.`)]
      });

    const confirmation = await confirm(
      interaction,
      new MessageEmbed()
        .setTitle('Pending Conformation')
        .setColor('BLURPLE')
        .setDescription(`Are you sure you want to warn ${member} for reason: \`${reason}\`?`)
        .setFooter({ text: 'You have 60 seconds.' })
    );

    if (confirmation.proceed) {
      const warnID = getRandomString(5);
      await new Warning({
        GuildID: interaction.guild.id,
        WarnID: warnID,
        UserID: member.id,
        Reason: reason,
        Moderator: interaction.user.id
      }).save();
      const embed = new MessageEmbed()
        .setColor('BLURPLE')
        .setDescription(`**${member.user.tag}** was warned for \`${reason}\`.`);

      try {
        await member.send({
          embeds: [
            new MessageEmbed()
              .setTitle('You were warned')
              .setColor('BLURPLE')
              .addField('Reason', reason, false)
              .addField('Warn ID', warnID, false)
              .addField('Date', time(new Date(), 'F'), false)
              .addField('Guild', interaction.guild.name, false)
          ]
        });
      } catch (err) {
        embed.setFooter({
          text: `I was not able to DM inform them`
        });
      }
      return await confirmation.i.update({
        embeds: [embed],
        components: []
      });
    }

    const embed = new MessageEmbed()
      .setTitle('Process Cancelled')
      .setColor('BLURPLE')
      .setDescription(`${member} was not warned.`);

    if (confirmation.reason) embed.setFooter({ text: confirmation.reason });

    await confirmation.i.update({
      embeds: [embed],
      components: []
    });
  }
};
