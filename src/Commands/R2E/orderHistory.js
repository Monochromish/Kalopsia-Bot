const { MessageEmbed } = require('discord.js');
const structureConfig = require('../../Structures/Config');
const guildId = structureConfig.guildOnly.guildID;
const Order = require('../../Models/Order');

module.exports = {
  name: 'order-history',
  description: `confirm your order history`,
  type: 'COMMAND',
  async run({ interaction, bot }) {
    const guild = await bot.guilds.cache.get(guildId);
    const userId = interaction.user.id;
    const orders = await Order.find({
      UserID: userId,
      GuildID: guild.id,
    });
    const messageEmbeds = new MessageEmbed();

    await interaction.deferReply({ ephemeral: true });

    if (orders.length === 0) {
      await interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setColor('BLURPLE')
            .setDescription(`You don't have order records.`),
        ],
      });
      return;
    }

    orders.map((order) => {
      const size = order.Size ? order.Size : 'free';
      messageEmbeds.addFields([
        {
          name: '주문 정보',
          value: `이름: ${
            order.UserName
          }, 날짜: ${order.OrderDate.toISOString().slice(0, 10)}, 주소: ${
            order.Address
          }, 핸드폰 번호: ${order.Phone}, 상품 번호: ${String(
            order.GoodsNumber
          )}, 상품 사이즈: ${String(size)}`,
          inline: false,
        },
      ]);
    });

    await interaction.editReply({
      embeds: [messageEmbeds],
      ephemeral: true,
    });
  },
};
