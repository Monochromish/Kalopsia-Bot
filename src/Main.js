const config = require('./Structures/Config');
const Bot = require('./Structures/Bot');

const bot = new Bot(config);

bot.start();

/* Error handling (Highly not recommend). To use it, remove the comments from the line below. */
// process.on('uncaughtException', console.error);
// process.on('unhandledRejection', console.error);
