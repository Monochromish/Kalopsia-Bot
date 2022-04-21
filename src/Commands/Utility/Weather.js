const { MessageEmbed } = require('discord.js');
const weather = require('weather-js');
module.exports = {
  name: 'weather',
  description: 'Displays weather information.',
  options: [
    {
      name: 'location',
      description: 'Provide a city or state name.',
      required: true,
      type: 'STRING'
    }
  ],
  category: 'Utility',
  async run({ interaction, bot }) {
    const location = interaction.options.getString('location');
    weather.find({ search: location, degreeType: 'C' }, function (err, result) {
      if (err) return; // cuz yes
      if (result.length === 0)
        return interaction.reply({ content: 'Please provide a valid city or state name', ephemeral: true });
      var current = result[0].current;
      var location = result[0].location;
      interaction.reply({
        embeds: [
          new MessageEmbed()
            .setAuthor({ name: `Weather: ${current.observationpoint}` })
            .setColor('BLURPLE')
            .setThumbnail(current.imageUrl)
            .addField('Timezone', `UTC ${location.timezone}`, true)
            .addField('Temperature', `${current.temperature}°`, true)
            .addField('Feels Like', `${current.feelslike}°`, true)
            .addField('Wind Display', `${current.winddisplay}`, true)
            .addField('Humidity', `${current.humidity}%`, true)
            .addField('Day and Date', `${current.day} ${current.date}`, true)
            .setFooter({ text: `${current.skytext}` })
        ]
      });
    });
  }
};
