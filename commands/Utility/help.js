const pagination = require('discord.js-pagination');
const Discord = require('discord.js');

module.exports = {
    name: "help",
    description: "Help Desk",

    async run (client, message, args){

        const fun = new Discord.MessageEmbed()
        .setTitle('Fun Commands')
        .addField('`8ball`', 'Answers your question')
        .addField('`advice`', 'Gives you a random advice')
        .addField('`kiss`', 'Kiss mentioned user')
        .addField('`dm`', 'DM a user in guild')
        .setColor('RANDOM')
        .setTimestamp()

        const economy = new Discord.MessageEmbed()
        .setTitle('Economy Commands')
        .addField('`balance`', 'Check your bank and wallet balance')
        .addField('`buy`', 'Buy something from store')
        .addField('`daily`', 'Collect your Daily Cash')
        .addField('`deposit`', 'Deposit your wallet balance to your bank account')
        .addField('`inventory`', 'Check your Inventory/Backpack')
        .addField('`pay`', 'Pay someone cash')
        .addField('`rob`', 'Rob someones wallet balance [You need Gun to use this command, buy one from store]')
        .addField('`store`', 'Check store')
        .addField('`withdraw`', 'Withdraw some amount from your bank account')
        .addField('`work`', 'Work for money')
        .setColor('RANDOM')
        .setTimestamp()

        const moderation = new Discord.MessageEmbed()
        .setTitle('Moderation Commands')
        .addField('`addrole`', 'Add a role on someone')
        .addField('`ban / unban / idban`', 'Ban someone / Unban someone / Ban an ID')
        .addField('`clear`', 'Purge Commands')
        .addField('`disablewelcome / setwelcome`', 'Disable / Enable welcome message')
        .addField('`kick`', 'Kick someone')
        .addField('`lockchannel / unlockchannel`', 'Lock / Unlock channel')
        .addField('`mute / unmute`', 'Mute someone / Unmute someone')
        .addField('`say`', 'Control the Bot by making it say anything')
        .addField('`shutdown`', 'Owner Command Only')
        .addField('`slowmode`', 'Add a slowmode to a channel')
        .addField('`warn / unwarn`', 'Warn someone / Unwarn someone')
        .addField('`warnings`', 'Check someones warnings')
        .setColor('RANDOM')
        .setTimestamp()

        const memes = new Discord.MessageEmbed()
        .setTitle('Meme Commands')
        .addField('`facepalm`', 'smh')
        .addField('`meme`', 'LOL')
        .addField('`shit`', 'step on shit [Mention Someone]')
        .addField('`slap`', 'Slap someone [Mention Someone]')
        .addField('`triggered `', 'TRIGGER')
        .setColor('RANDOM')
        .setTimestamp()
        
        const music = new Discord.MessageEmbed()
        .setTitle('Music Commands')
        .addField('`autoplay`', 'Turn Autoplay on / off')
        .addField('`filter`', 'Add different filters to your song')
        .addField('`join / leave`', 'Make the bot join VC / Make the bot leave VC')
        .addField('`loop`', 'Turn Loop filters on / off')
        .addField('`resume / pause`', 'Resume / Pause')
        .addField('`queue`', 'Queue')
        .addField('`play`', 'Play a song')
        .addField('`seek`', 'Seek')
        .addField('`skip`', 'Skip')
        .addField('`stop`', 'Stop')
        .addField('`volume`', 'Change Volume')
        .setColor('RANDOM')
        .setTimestamp()

        const nsfw = new Discord.MessageEmbed()
        .setTitle('NSFW Commands')
        .addField('`anal`', ':underage:')
        .addField('`ass`', ':underage:')
        .addField('`boobs`', ':underage:')
        .addField('`gif`', ':underage:')
        .addField('`hentai`', ':underage:')
        .addField('`pussy`', ':underage:')
        .addField('`4k`', ':underage:')
        .addField('`slut`', ':underage:')
        .setColor('RANDOM')
        .setTimestamp()

        const giveaway = new Discord.MessageEmbed()
        .setTitle('Giveaway Commands')
        .addField('`start`', ':Host a giveaway:')
        .addField('`reroll`', 'Reroll a giveaway')
        .addField('`end`', 'End a giveaway')
        .setColor('RANDOM')
        .setTimestamp()

        const utility = new Discord.MessageEmbed()
        .setTitle('Utility Commands')
        .addField('`avatar`', 'Check someones avatar')
        .addField('`calculator`', 'Solve your maths homework')
        .addField('`config`', 'Check guilds config')
        .addField('`help`', 'Help desk')
        .addField('`ping`', 'Pong')
        .addField('`rank`', 'Check someones rank')
        .addField('`serverinfo / userinfo`', 'Check guilds info / Check someones info')
        .addField('`weather`', 'Check weather of a location')
        .setColor('RANDOM')
        .setTimestamp()

        const about = new Discord.MessageEmbed()
        .setTitle('FAQ')
        .addField('`How to use commands`', 'to use a command, type [prefix] [command name]')
        .addField('`Why are there bugs in this bot`', 'This bot is currently in beta mode, if you come across a bug, please report the bug to the bot dev')
        .addField('`Who is the bot dev`', 'Monochromish is the owner of this bot, 500315184510795819 <= ID')
        .addField('`How do i report a bug`', 'It is simple, just message the bug to this ID => 500315184510795819')
        .setColor('RANDOM')
        .setTimestamp()

        const pages = [
                fun,
                economy,
                moderation,
                memes,
                music,
                nsfw,
                giveaway,
                utility,
                about
        ]

        const emojiList = ["⏪", "⏩"];

        const timeout = '120000';

        pagination(message, pages, emojiList, timeout)
    }
}