module.exports = {
  botOptions: {
    intents: ['32767'] // To learn more about intents, go to Discord Developer Portal.
  },
  guildOnly: {
    enabled: false,
    guildID: '' // Guild ID
  } // If set to true, slash commands will only be registered only under the guild with specified guild ID; Else globally registered.
};
