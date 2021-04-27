const client = require('nekos.life');
const Discord = require('discord.js')
const neko = new client();

module.exports = {
  name: "slut",
  category: "NSFW",
  usage: "[prefix]slut",
  run: async (client, message, args) => {

  var errMessage = "This channel is not a NSFW channel";
  if (!message.channel.nsfw) {
      message.react('💢');

      return message.reply(errMessage)
      .then(msg => {
      msg.delete({ timeout: 3000 })
      })
      
  }

        async function work() {
        let owo = (await neko.nsfw.cumsluts());

        const cumslut = new Discord.MessageEmbed()
        .setTitle("slut")
        .setImage(owo.url)
        .setColor(`RANDOM`)
        .setURL(owo.url);
        message.channel.send(cumslut);

}

      work();
}
                };