const randomPuppy = require('random-puppy')
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'meme',
    description: "LMFAO",
    usage: "[prefix]meme",
    run: async(client, message, args) => {

        if (!message.channel.nsfw) return message.channel.send('Enable NSFW Channel on this Channel to use this command, this is because there is a possibility that you might come across an NSFW meme') 

        const subReddits = ['dankmemes']//You can have name of any subreddit here
        const random = subReddits[Math.floor(Math.random() * subReddits.length)]

        const img = await randomPuppy(random)


        const embed = new MessageEmbed()
        .setColor("RANDOM")
        .setImage(img)
        .setTitle(`Meme from ${random} subreddit`)
        .setURL(`https://reddit.com/r/${random}`)
        .setFooter('Please wait for the meme to load...')


    
    message.channel.send(embed);

    }
}