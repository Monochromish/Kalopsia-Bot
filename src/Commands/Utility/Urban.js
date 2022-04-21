const { MessageEmbed } = require('discord.js');
var Filter = require('bad-words'),
  customFilter = new Filter({
    placeHolder: function () {
      var grawlix = '#!@$%&£';
      return grawlix[Math.floor(Math.random() * grawlix.length)];
    }
  });
const { getResponse } = require('../../Structures/Utils');
const moment = require('moment');
module.exports = {
  name: 'urbandictionary',
  description: 'Displays definition of a word in the UrbanDictionary.',
  options: [
    {
      name: 'word',
      description: 'Provide a word.',
      required: true,
      type: 'STRING'
    }
  ],
  category: 'Utility',
  async run({ interaction, bot }) {
    const word = interaction.options.getString('word');
    const response = await getResponse(`http://api.urbandictionary.com/v0/define?term=${word}`);
    if (!response.success) {
      interaction.reply(`Couldn't find a definition for ${word} on the UrbanDictionary`);
    }
    let json = response.data;
    if (!json.list[0]) {
      interaction.reply(`Couldn't find a definition for ${word} on the UrbanDictionary`);
    }
    let data = json.list[0];
    let definition = data.definition;
    if (data.definition.length > 1000) {
      definition = data.definition.slice(0, 950) + `...[Learn More](${data.permalink})`;
    }
    let example = data.example;
    if (data.example > 1000) {
      example = data.example.slice(0, 950) + `... [Learn More](${data.permalink})`;
    }
    let author = data.author;
    if (data.author > 1000) {
      author = data.author.slice(0, 950) + `...[Learn More](${data.permalink})`;
    }
    if (!interaction.channel.nsfw) {
      interaction.reply({
        embeds: [
          new MessageEmbed()
            .setTitle(`UrbanDictionary: ${customFilter.clean(data.word)}`)
            .setURL(data.permalink)
            .setColor('BLURPLE')
            .setThumbnail('https://reclaimthenet.org/wp-content/uploads/2020/07/urban-dictionary.png')
            .addField('Definition', customFilter.clean(definition), false)
            .addField('Example', customFilter.clean(example), false)
            .addField('Author', customFilter.clean(data.author), false)
            .addField('Likes / Dislikes', '👍 ' + data.thumbs_up + ' || 👎 ' + data.thumbs_down, false)
            .addField('Created', `<t:${moment(data.written_on).unix()}:R>`, false)
        ]
      });
    } else {
      interaction.reply({
        embeds: [
          new MessageEmbed()
            .setTitle(`UrbanDictionary: ${data.word}`)
            .setURL(data.permalink)
            .setColor('BLURPLE')
            .setThumbnail('https://reclaimthenet.org/wp-content/uploads/2020/07/urban-dictionary.png')
            .addField('Definition', definition, false)
            .addField('Example', example, false)
            .addField('Author', author, false)
            .addField('Likes / Dislikes', '👍 ' + data.thumbs_up + ' || 👎 ' + data.thumbs_down, false)
            .addField('Created', `<t:${moment(data.written_on).unix()}:R>`, false)
        ]
      });
    }
  }
};
