const { MessageEmbed } = require('discord.js');
const Profile = require('../Models/Profile');
const structureConfig = require('../Structures/Config');
const { createOrder, getCurrentKoreanDate } = require('../Structures/Utils');
const guildId = structureConfig.guildOnly.guildID;
const postOrderGoogleSheet = require('../Structures/postOrderGoogleSheet');

module.exports = {
  event: 'interactionCreate',
  type: 'MODAL_SUBMIT',
  async run(bot, interaction) {
    if (!interaction.customId) return;

    if (interaction.customId.includes('orderInformation')) {
      const guild = await bot.guilds.cache.get(guildId);
      const userId = interaction.user.id;
      const today = getCurrentKoreanDate();
      const inputValue = [];
      const [goodsNumber, goodsPrice] = interaction.customId.match(/\d+/g);
      const sheetName = 'order';
      const profile = await Profile.find({ UserID: userId, GuildID: guild.id });
      interaction.components.map((component) => {
        const componentProperty = component.components[0];
        inputValue.push(componentProperty.value);
      });
      const cellRange = inputValue.length === 3 ? 'A:F' : 'A:G';

      inputValue.splice(1, 0, userId, today, goodsNumber);

      if (!profile.length) {
        await interaction.reply({
          embeds: [
            new MessageEmbed()
              .setColor('RED')
              .setDescription(`You don't have profile. Make a profile first.`),
          ],
        });
        return;
      }

      await Profile.updateOne(
        { UserID: userId, GuildID: guild.id },
        { $inc: { Wallet: -goodsPrice } }
      );
      await createOrder(guild.id, inputValue);
      inputValue.splice(2, 1, today.toISOString().slice(0, 10));
      await postOrderGoogleSheet(`${sheetName}!${cellRange}`, inputValue);
      await interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor('BLURPLE')
            .setDescription(`Your order was completed successfully!`),
        ],
      });
    }
  },
};
