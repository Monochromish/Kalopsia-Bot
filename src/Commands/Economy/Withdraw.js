const { MessageEmbed } = require('discord.js');
const Profile = require('../../Models/Profile');
const { createProfile } = require('../../Structures/Utils');

module.exports = {
  name: 'withdraw',
  description: 'Withdraw your money from bank.',
  options: [
    {
      name: 'amount',
      description: 'Specify amount.',
      required: true,
      type: 'NUMBER'
    }
  ],
  category: 'Economy',
  async run({ interaction, options, bot, guild }) {
    const profile = await Profile.find({ UserID: interaction.user.id, GuildID: guild.id });
    if (!profile.length) {
      await createProfile(interaction.user, guild);
      await interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor('BLURPLE')
            .setDescription(`Creating profile.\nUse this command again to withdraw your money.`)
        ]
      });
    } else {
      const amount = options.getNumber('amount');
      if (amount > profile[0].Bank) {
        await interaction.reply({
          embeds: [new MessageEmbed().setColor('BLURPLE').setDescription(`You don't have enough money to withdraw.`)]
        });
      } else {
        await Profile.updateOne(
          { UserID: interaction.user.id, GuildID: guild.id },
          { $inc: { Wallet: amount, Bank: -amount } }
        );
        await interaction.reply({
          embeds: [new MessageEmbed().setColor('BLURPLE').setDescription(`Withdrew ${amount} € from bank.`)]
        });
      }
    }
  }
};
