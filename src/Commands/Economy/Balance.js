const { MessageEmbed } = require('discord.js');
const Profile = require('../../Models/Profile');
const { createProfile } = require('../../Structures/Utils');

module.exports = {
  name: 'balance',
  description: "Check user's balance.",
  options: [
    {
      name: 'user',
      description: 'Mention user.',
      required: false,
      type: 'USER'
    }
  ],
  category: 'Economy',
  async run({ interaction, options, bot, guild }) {
    const user = options.getUser('user') || interaction.user;

    const profile = await Profile.find({ UserID: user.id, GuildID: guild.id });
    if (!profile.length) {
      if (user !== interaction.user) return interaction.reply(`${user} has no profile.`); // Prevents others from creating profiles for other users.

      await createProfile(interaction.user, guild);
      await interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor('BLURPLE')
            .setDescription(`Creating profile.\nUse this command again to check your balance.`)
        ]
      });
    } else {
      await interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor('BLURPLE')
            .setTitle(`${user.username}'s Balance`)
            .setDescription(`**Wallet:** ${profile[0].Wallet} €\n**Bank:** ${profile[0].Bank} €`)
        ]
      });
    }
  }
};
