const weather = require('weather-js');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'weather',
    description: "Gives You The Weather and info about a specific place",
    usage: "[prefix]weather [location]", 
    aliases: ['temp', 'time', 'temperatire', 'weather'],
    run: async(client, message, args) => {
        const ErrorEmbed  = new MessageEmbed()
        .setDescription("Please specify a location")
        .setColor("RAMDOM")

        weather.find({search: args.join(" "), degreeType: 'C'}, function(error, result) {
            if(error) return message.channel.send(error)
            if(!args[0]) return message.channel.send(ErrorEmbed)

            if( result === undefined || result.lenght === 0) return message.channel.send("Invalid Location :x:")
            var current = result[0].current;
            var location = result[0].location;

            const weatherInfo = new MessageEmbed()
            .setDescription(`**${current.skytext}**`)
            .setAuthor(`Weather Report For ${current.observationpoint}`)
            .setImage(current.imageUrl)
            .setColor("RANDOM")
            .addField("Timezone" , `UTC${location.timezone}`, true)
            .addField("Degree Type" , "Celcius", true)
            .addField("Temperature", `${current.temperature}` , true)
            .addField('Wind', `${current.winddisplay}` , true)
            .addField('Feels Like', `${current.feelslike}`, true)
            .addField('Humidity', `${current.humidity}` , true)
            .setFooter('Data is being provided from weather.service.msn.com , if the data is wrong, please report them and not the bot dev')


            message.channel.send(weatherInfo)
        })
    }
}