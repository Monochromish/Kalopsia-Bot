const { MessageEmbed } = require('discord.js');
const Profile = require('../../Models/Profile');
const { createProfile } = require('../../Structures/Utils');

module.exports = {
  name: 'deposit',
  description: 'Deposit your wallet money to bank.',
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
            .setDescription(`Creating profile.\nUse this command again to deposit your money.`)
        ]
      });
    } else {
      const amount = options.getNumber('amount');
      if (amount > profile[0].Wallet) {
        await interaction.reply({
          embeds: [new MessageEmbed().setColor('BLURPLE').setDescription(`You don't have enough money to deposit.`)]
        });
      } else {
        await Profile.updateOne(
          { UserID: interaction.user.id, GuildID: guild.id },
          { $inc: { Wallet: -amount, Bank: amount } }
        );
        await interaction.reply({
          embeds: [new MessageEmbed().setColor('BLURPLE').setDescription(`Deposited ${amount} € to bank.`)]
        });
      }
    }
  }
};
