const db = require('quick.db')

module.exports = (message) => {
    let prefix = process.env.prefix
    if(message.content.startsWith(prefix)) return;
    const randomNumber = Math.floor(Math.random() * 10) + 15
    db.add(`guild_${message.guild.id}_xp_${message.author.id}`, randomNumber)
    db.add(`guild_${message.guild.id}_xptotal_${message.author.id}`, randomNumber)
    var level = db.get(`guild_${message.guild.id}_level_${message.author.id}`) || 1
    var xp = db.get(`guild_${message.guild.id}_xp_${message.author.id}`)
    var xpNeeded = level * 500
    if(xpNeeded < xp) {
        var newLevel = db.add(`guild_${message.guild.id}_level_${message.author.id}`, 1)
        db.subtract(`guild_${message.guild.id}_xp_${message.author.id}`, xpNeeded)
        message.channel.send(`Congratulations ${message.author}, you have leveled up ⏫, GG!!!. You are now Level : ${newLevel}`)
    }
}