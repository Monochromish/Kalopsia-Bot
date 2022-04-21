const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');
const { pretty } = require('../../Structures/Utils');

module.exports = {
  name: 'help',
  description: 'Get some help!',
  category: 'Info',
  async run({ interaction, bot }) {
    const set = new Set();
    bot.commands.forEach(cmd => set.add(cmd.category));
    const categories = [...set.values()];

    const home = {
      embeds: [
        new MessageEmbed()
          .setTitle(`Help for ${bot.user.username}`)
          .setDescription(
            categories
              .map(
                category =>
                  `**${category}**\n${bot.commands
                    .filter(cmd => cmd.category === category)
                    .map(cmd => `\`/${pretty(cmd.name)}\``)
                    .join(', ')}`
              )
              .join('\n')
          )
          .setColor('BLURPLE')
      ],
      components: [
        new MessageActionRow().addComponents(
          new MessageSelectMenu()
            .setPlaceholder('Help Select Menu')
            .setCustomId('Help-Select-Menu')
            .addOptions(
              categories.map(category => {
                return {
                  label: category,
                  value: category,
                  description: `The ${category} commands.`,
                  emoji: '📜'
                };
              })
            )
        )
      ]
    };

    const homeButton = {
      label: 'Home',
      value: 'Home',
      description: 'Go back to the main menu.',
      emoji: '🏠'
    };

    const m = await interaction.reply({
      ...home,
      fetchReply: true
    });

    const collector = m.createMessageComponentCollector({
      time: 1000 * 60 * 3
    });

    const syntax = cmd =>
      `\`/${pretty(cmd.name)}${
        cmd.options
          ? ` ${cmd.options
              .map(option => (option.required ? `<${pretty(option.name)}>` : `[${pretty(option.name)}]`))
              .join(' ')}`
          : ''
      }\``;

    collector.on('collect', async i => {
      if (i.user.id !== interaction.user.id)
        return await i.reply({
          embeds: [new MessageEmbed().setColor('RED').setDescription(`That's not meant for you!`)],
          ephemeral: true
        });
      const val = i.values[0];
      // It's a category, otherwise a command or home
      if (val === 'Home') return await i.update(home);
      if (categories.includes(val))
        return await i.update({
          embeds: [
            new MessageEmbed()
              .setTitle(`Help for ${val}`)
              .setDescription(
                bot.commands
                  .filter(cmd => cmd.category === val)
                  .map(cmd => syntax(cmd))
                  .join(', ')
              )
              .setColor('BLURPLE')
          ],
          components: [
            new MessageActionRow().addComponents(
              new MessageSelectMenu()
                .setPlaceholder('Commands and Help Select Menu')
                .setCustomId('Commands-and-help-select-menu')
                .addOptions([
                  ...bot.commands
                    .filter(cmd => cmd.category === val)
                    .map(cmd => {
                      return {
                        label: pretty(cmd.name),
                        value: cmd.name,
                        description: cmd.description,
                        emoji: '🔧'
                      };
                    }),
                  homeButton
                ])
            )
          ]
        });

      const cmd = bot.commands.get(val);
      if (!cmd) return;

      await i.update({
        embeds: [
          new MessageEmbed()
            .setTitle(`Help for ${cmd.name}`)
            .setDescription(
              `
**Name:** ${pretty(cmd.name)}
**Description:** ${cmd.description}
**Category:** ${cmd.category}
**Syntax:** ${syntax(cmd)}
        `
            )
            .setColor('BLURPLE')
        ],
        components: [
          new MessageActionRow().addComponents(
            new MessageSelectMenu()
              .setPlaceholder('Category and Help Select Menu')
              .setCustomId('Category-and-help-command-menu')
              .addOptions([
                homeButton,
                {
                  label: cmd.category,
                  value: cmd.category,
                  description: `The ${cmd.category} commands`,
                  emoji: '📜'
                }
              ])
          )
        ]
      });
    });
  }
};
