const { MessageActionRow, MessageButton } = require('discord.js');
const { promisify } = require('util');
const glob = require('glob');
const axios = require('axios').default;
const Profile = require('../Models/Profile');

module.exports = {
  getRandomString: length => {
    const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
  },
  search: promisify(glob),
  sleep: promisify(setTimeout),
  pretty: str => str[0].toUpperCase() + str.slice(1).toLowerCase(),
  plural: num => (num === 1 ? '' : 's'),
  confirm: async (interaction, embed) => {
    const msg = await interaction.reply({
      embeds: [embed],
      components: [
        new MessageActionRow().addComponents(
          new MessageButton().setCustomId('proceed').setStyle('SUCCESS').setLabel('Proceed'),
          new MessageButton().setCustomId('cancel').setStyle('DANGER').setLabel('Cancel')
        )
      ],
      fetchReply: true
    });

    const i = await msg
      .awaitMessageComponent({ time: 1000 * 60, filter: i => i.user.id === interaction.user.id })
      .catch(() => null);
    if (!i)
      return {
        proceed: false,
        reason: 'Reason: Inactivity Timeout',
        i
      };

    if (i.customId === 'proceed')
      return {
        proceed: true,
        i
      };
    return {
      proceed: false,
      i
    };
  },
  getResponse: async function getResponse(url) {
    try {
      const res = await axios.get(url);
      return {
        success: true,
        status: res.status,
        data: res.data
      };
    } catch (error) {
      return {
        success: false,
        status: error.response?.status,
        data: error.response?.data
      };
    }
  },
  createProfile: async function createProfile(user, guild) {
    const profile = await Profile.find({ UserID: user.id, GuildID: guild.id });
    if (!profile.length) {
      await new Profile({
        GuildID: guild.id,
        UserID: user.id,
        Wallet: 0,
        Bank: 0,
        lastDaily: new Date(),
        lastWeekly: new Date(),
        lastMonthly: new Date(),
        passiveUpdated: new Date()
      }).save();
      return true;
    }
    return false;
  },
  shuffleArray: function (array) {
    let currentIndex = array.length,
      randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
  }
};
