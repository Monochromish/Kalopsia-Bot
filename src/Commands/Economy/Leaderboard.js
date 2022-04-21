const { MessageEmbed } = require('discord.js');
const Profile = require('../../Models/Profile');

module.exports = {
  name: 'leaderboard',
  description: 'Check the top 10 richest people (Wallet money) in server.',
  category: 'Economy',
  async run({ interaction, options, bot, guild }) {
    const profiles = await Profile.find({ GuildID: guild.id });
    if (!profiles.length) {
      await interaction.reply({
        embeds: [new MessageEmbed().setColor('BLURPLE').setDescription(`No one has any money.`)]
      });
    } else {
      const sortedProfiles = profiles.sort((a, b) => b.Wallet - a.Wallet);
      const top10 = sortedProfiles.slice(0, 10);
      const embed = new MessageEmbed()
        .setColor('BLURPLE')
        .setTitle('Top 10 Richest People')
        .setDescription(`**Wallet:**\n`);
      top10.forEach(profile => {
        embed.addField(`${bot.users.cache.get(profile.UserID).username}`, `${profile.Wallet} €`);
      });
      await interaction.reply({
        embeds: [embed]
      });
    }
  }
};
