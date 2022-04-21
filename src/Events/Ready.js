const { plural } = require('../Structures/Utils');

module.exports = {
  event: 'ready',
  async run(bot) {
    bot.user.setPresence({ activities: [{ name: `the world`, type: 'WATCHING' }] });
    bot.logger.success(`${bot.user.tag} is now logged in!`);
    bot.logger.info(
      `Loaded ${bot.commands.size} commands for ${bot.guilds.cache.size} guild${plural(bot.guilds.cache.size)}.`
    );
  }
};
