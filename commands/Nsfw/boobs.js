const superagent = require("node-fetch");
const Discord = require('discord.js')

const rp = require('request-promise-native');

module.exports = {
    name: "boobs",
    category: "NSFW",
  description: "Sends boobs",
  run: async (client, message, args, level) => {

  var errMessage = "This channel is not a NSFW channel";
  if (!message.channel.nsfw) {
      message.react('💢');

      return message.reply(errMessage)
      .then(msg => {
      msg.delete({ timeout: 3000 })
      })
      
  }

  return rp.get('http://api.oboobs.ru/boobs/0/1/random').then(JSON.parse).then(function(res)  {
    return rp.get({
        url:'http://media.oboobs.ru/' + res[0].preview,
        encoding: null
    });
}).then(function(res)   {

const boobs = new Discord.MessageEmbed()
      .setTitle("Boobs")
      .setColor(`RANDOM`)
      .setImage("attachment://file.png").attachFiles([{ attachment: res, name: "file.png" }])


    message.channel.send(boobs);
});
  }
  };