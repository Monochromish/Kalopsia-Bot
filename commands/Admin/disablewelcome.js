const { MessageEmbed } = require('discord.js')
const db = require('quick.db')

module.exports = {
    name: 'disablewelcome',
    description: "Disables the Welcome Feature",
    usage: "[prefix]disablewelcome",
    alises: [],
    run: async(client, message, args) => {
        if(!message.member.hasPermission('ADMINISTRATOR')) {
            if(!message.author.id === message.guild.ownerID){
                const disablewelcomeError = new MessageEmbed()
                .setDescription(`You don\'t have permissions to set welcome channel`)
                .setColor("RANDOM")
                return message.channel.send(disablewelcomeError)
            }                 
        }
        let guildConfig = db.get(`guildConfigurations_${message.guild.id}.welcome`)
        if(guildConfig === null) guildConfig = 'disabled'
        if(guildConfig === 'disabled') {
            const disablewelcomeError2 = new MessageEmbed()
            .setDescription(`It is already disabled.`)
            .setFooter('Use \`config\` to check server configuration')
            .setColor("RANDOM")
            return message.channel.send(disablewelcomeError2)
        }
        db.set(`guildConfigurations_${message.guild.id}.welcome`, 'disabled')
        const embed = new MessageEmbed()
        .setAuthor(`Welcome Feature has been disabled`)
        .setDescription(`Use setwelcome command to turn this feature on`)
        .setColor("RANDOM")

        message.channel.send(embed)
    }
}