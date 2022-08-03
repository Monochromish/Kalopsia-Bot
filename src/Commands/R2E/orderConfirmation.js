const { MessageEmbed } = require('discord.js');
const structureConfig = require('../../Structures/Config');
const guildId = structureConfig.guildOnly.guildID;
const Order = require('../../Models/Order');

module.exports = {
  name: 'order-confirmation',
  description: `confirm your order`,
  type: 'COMMAND',
  async run({ interaction, bot }) {
    const guild = await bot.guilds.cache.get(guildId);
    const userId = interaction.user.id;
    const orders = await Order.find({
      UserID: userId,
      GuildID: guild.id,
    });
    const messageEmbeds = new MessageEmbed();

    await interaction.deferReply();

    orders.map((order) => {
      const size = order.Size ? order.Size : 'free';
      messageEmbeds
        .setTitle('Your orders')
        .addField('User Name', order.UserName, true)
        .addField('Order Date', order.OrderDate, true)
        .addField('Goods Number', String(order.MerchNumber), true)
        .addField('Address', order.Address, true)
        .addField('Phone Number', order.Phone, true)
        .addField('Count', String(order.Count), true)
        .addField('Size', String(size), true);
    });

    if (messageEmbeds.length === 0) {
      await interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setColor('BLURPLE')
            .setDescription(`You don't have order records.`),
        ],
      });
    } else {
      await interaction.editReply({
        embeds: [messageEmbeds],
      });
    }
  },
};
