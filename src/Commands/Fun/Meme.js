const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  name: 'meme',
  description: 'Sends meme.',
  category: 'Fun',
  async run({ interaction, bot }) {
    let meme = await fetch('https://meme-api.herokuapp.com/gimme').then(r => r.json());
    let interaction_message = await interaction.reply({
      embeds: [
        new MessageEmbed()
          .setTitle(meme.title)
          .setURL(meme.postLink)
          .setImage(meme.url)
          .setColor('BLURPLE')
          .setFooter({ text: `${meme.ups}👍 || r/${meme.subreddit}` })
      ],
      components: [
        new MessageActionRow().addComponents([
          new MessageButton().setLabel('Refresh').setStyle('PRIMARY').setCustomId('refresh-button')
        ])
      ],
      fetchReply: true
    });
    const collector = await interaction_message.createMessageComponentCollector({
      filter: fn => fn,
      componentType: 'BUTTON'
    });

    collector.on('collect', async i => {
      if (i.user.id !== interaction.user.id)
        return i.reply({
          content: `These buttons are not for you.`,
          ephemeral: true
        });
      if (i.customId === 'refresh-button') {
        await i.deferUpdate();
        let meme2 = await fetch('https://meme-api.herokuapp.com/gimme').then(r => r.json());
        return interaction_message.edit({
          embeds: [
            new MessageEmbed()
              .setTitle(meme2.title)
              .setURL(meme2.postLink)
              .setImage(meme2.url)
              .setColor('BLURPLE')
              .setFooter({ text: `${meme2.ups}👍 〢 r/${meme2.subreddit}` })
          ]
        });
      }
    });
  }
};
