const { MessageEmbed } = require('discord.js');
const Profile = require('../Models/Profile');
const structureConfig = require('../Structures/Config');
const { createOrder } = require('../Structures/Utils');
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
      const todayString = new Date().toISOString().slice(0, 10);
      const inputValue = [];
      const [merchNumber, merchPrice] = interaction.customId.match(/\d+/g);
      const sheetName = 'order';
      interaction.components.map((component) => {
        const componentProperty = component.components[0];
        inputValue.push(componentProperty.value);
      });
      const profile = await Profile.find({ UserID: userId, GuildID: guild.id });
      const merchCount = inputValue[3];
      const totalPrice = merchPrice * merchCount;
      if (profile[0].Wallet < totalPrice) {
        await interaction.reply({
          embeds: [
            new MessageEmbed()
              .setColor('RED')
              .setDescription(
                `You can't buy this goods because you don't have enough money`
              ),
          ],
        });
      } else {
        const cellRange = inputValue.length === 3 ? 'A:G' : 'A:H';
        inputValue.splice(1, 0, userId, todayString, merchNumber);
        await Profile.updateOne(
          { UserID: userId, GuildID: guild.id },
          { $inc: { Wallet: -totalPrice } }
        );
        await createOrder(guild.id, inputValue);
        await postOrderGoogleSheet(`${sheetName}!${cellRange}`, inputValue);
        await interaction.reply({
          embeds: [
            new MessageEmbed()
              .setColor('BLURPLE')
              .setDescription(`Your order was completed successfully!`),
          ],
        });
      }
    }
  },
};
