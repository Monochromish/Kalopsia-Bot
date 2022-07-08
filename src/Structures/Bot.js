const { Client, Collection } = require('discord.js');
const { connect } = require('mongoose');
const { search } = require('./Utils');
const consola = require('consola');
require('dotenv').config();
const Config = require('./Config');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);

module.exports = class Bot extends Client {
  constructor(config) {
    super(config.botOptions);
    this.config = config;
    this.commands = new Collection();
    this.logger = consola;
    db.defaults({
      voteStatus: { isVoting: false, voteId: 0, voteTitle: '' },
      bluechipList: [],
      risingList: [],
      voteUser: [],
    }).write();
  }

  async start() {
    await this.loadOperations();
    await connect(process.env.MONGO_URI);
    await this.login(process.env.TOKEN);

    if (Config.guildOnly.enabled == true && Config.guildOnly.guildID != '') {
      try {
        const guild = this.guilds.cache.get(Config.guildOnly.guildID);
        await guild.commands.set(this.commands);
        this.logger.info(
          `Commands registered in guild with ID ${Config.guildOnly.guildID}`
        );
      } catch (e) {
        this.logger.error(
          `Failed to register commands in guild with ID ${Config.guildOnly.guildID}\n${e}`
        );
      }
    } else {
      await this.application.commands.set(this.commands);
      this.logger.info(`Commands registered globally.`);
    }
  }

  async loadOperations() {
    const commands = await search(`${__dirname}/../Commands/**/*.js`);
    commands.forEach((commandName) => {
      const command = require(commandName);
      this.commands.set(command.name, command);
    });

    const events = await search(`${__dirname}/../Events/*.js`);
    events.forEach((eventName) => {
      const event = require(eventName);
      this.on(event.event, event.run.bind(null, this));
    });
  }
};
