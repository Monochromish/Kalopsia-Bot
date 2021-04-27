const { MessageEmbed } = require('discord.js')
const db = require('quick.db')

module.exports = {
    name: 'config',
    description: "Check Guilds Config",
    usage: "[prefix]config",
    aliases: ['config', 'configuration'],
    run: async(client, message, args) => {
        let welcomePlugin = db.get(`guildConfigurations_${message.guild.id}.welcome`)
        if(welcomePlugin === null) welcomePlugin = 'Disabled'
        let welcomeChannel = db.get(`Welcome_Channel_${message.guild.id}`)
        if(welcomeChannel === null) welcomeChannel = 'None'
        if(welcomeChannel !== null) welcomeChannel = `<#${welcomeChannel}>`
        

        const embed = new MessageEmbed()
        .setAuthor(`Guild Settings`)
        .addField(`**Settings**`, [
            `Welcome Plugin : ${welcomePlugin}

            ❯ Welcome Channel : ${welcomeChannel}`
        ])
        .setColor("RANDOM")
        
        
        message.channel.send(embed)
    }
}