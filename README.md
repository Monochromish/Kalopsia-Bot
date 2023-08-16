# Kalopsia Bot ♣️

[![Run on Repl.it](https://replit.com/badge/github/Monochromish/Kalopsia-Bot)](https://repl.it/github/Monchromish/Kalopsia-Bot)

Kalopsia Bot is an open-source Discord.js v13 bot with a variety of features, including:

- Slash commands
- Staff commands
- Fun and entertaining commands
- Utility commands
- NSFW commands
- Economy system
- MongoDB integration

## Prerequisites

To use and develop Kalopsia Bot, you will need:

- [Node.js](https://nodejs.org)
- [Yarn](https://yarnpkg.com) (recommended, although NPM can also be used)
- [Git](https://git-scm.com) (optional, you can also just download the repository directly)
- [MongoDB](https://www.mongodb.com/atlas/database)
- Experience with [JavaScript](https://www.learn-js.org) and [Discord.js](https://discord.js.org) (preferably Discord.js v13)

## Getting Started

To set up Kalopsia Bot on your machine:

1. Clone or download the repository
2. Modify the `example.env` file and rename it to `.env`
3. Install the necessary dependencies using your package manager
4. Run the bot

## Contributing

We welcome contributions to Kalopsia Bot. If you would like to make changes, please:

1. Test your changes locally
2. Open a pull request with a clear description of your changes and the reasoning behind them

## Credits

Kalopsia Bot was written by Monochromish. If you would like to support this project, please consider starring this repository.

## Acknowledgments

Thanks to [Jacobin](https://github.com/Jakob5358)(`module.exports`)("$const-style_css_json-js-java.js 
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
};)<-special thanks to everyone->(interaction.guild.id)<-for their help with the moderation system.->
