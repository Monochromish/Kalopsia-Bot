const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const ms = require('ms');
module.exports = {
  name: 'notifyme',
  description: 'Set a reminder.',
  options: [
    {
      name: 'timer',
      description: 'When should I notify you?',
      required: true,
      type: 'STRING'
    },
    {
      name: 'reminder',
      description: 'What should I remind you?',
      required: false,
      type: 'STRING'
    }
  ],
  category: 'Utility',
  async run({ interaction, bot }) {
    await interaction.deferReply().catch(() => {});

    const timer = interaction.options.getString('timer');
    const reminder = interaction.options.getString('reminder') || '*No reminder set*';
    if (!timer || isNaN(ms(timer))) return interaction.editReply({ content: 'Provide a valid timer' });
    const milliseconds = ms(timer);
    if (milliseconds > 2073600000) return interaction.editReply({ content: 'Timer has an upper limit of 24 days.' });
    const unix = (Date.now() / 1000 + milliseconds / 1000).toFixed(0);
    const redirect = await interaction.editReply({
      embeds: [
        new MessageEmbed()
          .setColor('BLURPLE')
          .setDescription('Reminder has been set')
          .addField("You'll be notified", `<t:${unix}:R>`)
          .addField('Reminder', `${reminder}`)
      ]
    });
    setTimeout(function () {
      interaction.member.send({
        embeds: [new MessageEmbed().setColor('BLURPLE').setDescription('Reminder').addField('Reminder', `${reminder}`)],
        components: [
          new MessageActionRow().addComponents(
            new MessageButton().setLabel('Redirect to Reminder').setURL(redirect.url).setStyle('LINK')
          )
        ]
      });
      return redirect.edit({
        embeds: [
          new MessageEmbed()
            .setColor('BLURPLE')
            .setDescription('Reminder was set')
            .addField('You were notified', `<t:${unix}:R>`)
            .addField('Reminder', `${reminder}`)
        ]
      });
    }, ms(timer));
  }
};
