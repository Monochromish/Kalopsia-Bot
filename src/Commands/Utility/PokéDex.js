const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { getResponse } = require('../../Structures/Utils');
module.exports = {
  name: 'pokedex',
  description: 'Displays information about specified pokémon.',
  options: [
    {
      name: 'pokemon',
      description: 'Name a pokemon.',
      required: true,
      type: 'STRING'
    }
  ],
  category: 'Utility',
  async run({ interaction, bot }) {
    const pokemon = interaction.options.getString('pokemon');
    const response = await getResponse(`https://pokeapi.glitch.me/v1/pokemon/${pokemon}`);
    if (response.status === 404) {
      interaction.editReply(`Couldn't find a pokémon with name ${pokemon}`);
    } else {
      if (!response.success) return;
      const json = response.data[0];
      if (!json) return;
      const name = json.name.toLowerCase();
      let hiddenAbilities = ` and ${json.abilities.hidden}.`;
      if (!json.abilities.hidden.length) {
        hiddenAbilities = '.';
      }
      let gender = json.gender;
      if (!json.gender.length) {
        gender = 'Genderless';
      }
      await interaction.reply({
        embeds: [
          new MessageEmbed()
            .setAuthor({
              name: `PokéDex: ${json.name}`,
              iconURL: `https://play.pokemonshowdown.com/sprites/ani/${name}.gif`
            })
            .setColor('BLURPLE')
            .setThumbnail(`https://play.pokemonshowdown.com/sprites/ani/${name}.gif`)
            .addField('Type(s)', `${json.types.join(', ')}`, false)
            .addField('Abilities', `${json.abilities.normal}${hiddenAbilities}`, false)
            .addField('Gender Ratio', `${gender}`, false)
            .addField('Height and Weight', `${json.height} foot tall\n${json.weight}`, false)
            .addField(
              'Evolutionary line',
              `${json.family.evolutionLine.join(', ')}\nCurrent Evolution Stage: ${json.family.evolutionStage}`,
              false
            )
            .addField('Generation', `${json.gen}`, false)
            .setFooter({ text: json.description })
        ],
        components: [
          new MessageActionRow().addComponents(
            new MessageButton()
              .setLabel('Bulbapedia')
              .setURL(`https://bulbapedia.bulbagarden.net/wiki/${json.name}`)
              .setStyle('LINK'),
            new MessageButton()
              .setLabel('Serebii')
              .setURL(`https://www.serebii.net/pokedex-swsh/${json.name.toLowerCase()}`)
              .setStyle('LINK'),
            new MessageButton()
              .setLabel('Smogon')
              .setURL(`https://www.smogon.com/dex/ss/pokemon/${json.name.toLowerCase()}`)
              .setStyle('LINK')
          )
        ]
      });
    }
  }
};
