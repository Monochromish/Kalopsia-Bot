const { confirm } = require('../../Structures/Utils');
const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'ban',
  description: 'Ban a member.',
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
      description: 'Specify reason for ban',
      required: true,
      type: 'STRING'
    }
  ],
  permissions: 'BAN_MEMBERS',
  async run({ interaction, bot, guild }) {
    const member = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason');

    if (!member.bannable)
      return interaction.reply({
        embeds: [new MessageEmbed().setColor('RED').setDescription(`I don't have permissions to ban ${member}.`)]
      });

    if (member.id === interaction.user.id)
      return interaction.reply({
        embeds: [new MessageEmbed().setColor('RED').setDescription(`You cannot ban yourself.`)]
      });

    const confirmation = await confirm(
      interaction,
      new MessageEmbed()
        .setTitle('Pending Conformation')
        .setColor('BLURPLE')
        .setDescription(`Are you sure you want to ban ${member} for reason: \`${reason}\`?`)
        .setFooter({ text: 'You have 60 seconds.' })
    );

    if (confirmation.proceed) {
      const embed = new MessageEmbed()
        .setColor('BLURPLE')
        .setDescription(`**${member.user.tag}** was banned for \`${reason}\`.`);

      try {
        await member.send({
          embeds: [
            new MessageEmbed()
              .setTitle('You were banned')
              .setColor('BLURPLE')
              .addField('Reason', reason, false)
              .addField('Guild', interaction.guild.name, false)
              .addField('Date', time(new Date(), 'F'), false)
          ]
        });
      } catch (err) {
        embed.setFooter({
          text: `I was not able to DM inform them`
        });
      }
      await confirmation.i.update({
        embeds: [embed],
        components: []
      });
      return await member.ban({ reason });
    }

    const embed = new MessageEmbed()
      .setTitle('Process Cancelled')
      .setColor('BLURPLE')
      .setDescription(`${member} was not banned.`);

    if (confirmation.reason) embed.setFooter({ text: confirmation.reason });

    await confirmation.i.update({
      embeds: [embed],
      components: []
    });
  }
};
