
const Discord = require("discord.js");
module.exports = {
    name: "pussy",
    category: "NSFW",
    usage: "[prefix]pussy",
    run: async (client, message, args) => {

    var superagent = require('superagent');

    if (!message.channel.nsfw) return message.channel.send('This channel is not a NSFW channel') 

    var lo = new Discord.MessageEmbed()
                .setDescription(`Please wait`)
                .setTimestamp()

    message.channel.send(lo).then(m => {

        superagent.get('https://nekobot.xyz/api/image').query({ type: 'pussy'}).end((err, response) => {

            var embed_nsfw = new Discord.MessageEmbed()
                .setDescription(`:underage:`)
                .setTimestamp()
                .setImage(response.body.message)
                .setFooter('Please wait for image to load')
            
            m.edit(embed_nsfw);
        });
    });
}
}