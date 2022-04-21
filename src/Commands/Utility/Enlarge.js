const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { parse } = require('twemoji-parser');
const { Util } = require('discord.js');
module.exports = {
  name: 'enlarge',
  description: 'Enlarge an emoji.',
  options: [
    {
      name: 'emoji',
      description: 'Provide an emoji.',
      required: true,
      type: 'STRING'
    }
  ],
  category: 'Utility',
  async run({ interaction, bot }) {
    const emoji = interaction.options.getString('emoji');
    const custom = Util.parseEmoji(emoji);
    const parsed = parse(emoji, { assetType: 'png' });

    if (!custom && !parsed[0]) interaction.reply('Invalid emoji.');

    const url = custom?.id
      ? `https://cdn.discordapp.com/emojis/${custom?.id}.${custom?.animated ? 'gif' : 'png'}`
      : parsed[0].url;

    custom?.id
      ? await interaction.reply({
          embeds: [
            new MessageEmbed().setAuthor({ name: 'Enlarged', url: url, iconURL: url }).setImage(url).setColor('BLURPLE')
          ],
          components: [
            new MessageActionRow().addComponents(
              new MessageButton()
                .setLabel(' 〢 Emoji Link')
                .setEmoji(custom.id)
                .setURL(`https://cdn.discordapp.com/emojis/${custom.id}.${custom.animated ? 'gif' : 'png'}`)
                .setStyle('LINK')
            )
          ]
        })
      : await interaction.reply({
          embeds: [
            new MessageEmbed().setAuthor({ name: 'Enlarged', url: url, iconURL: url }).setImage(url).setColor('BLURPLE')
          ]
        });
  }
};
