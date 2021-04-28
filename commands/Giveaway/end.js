const ms = require('ms');

module.exports = {
    name: 'end',
    description: "End Giveaways",
    usage: "[prefix]end <giveawayID>",
    aliases: ["end", "stop"],
    run: async(client, message, args) => {

    if(!message.member.hasPermission('MANAGE_MESSAGES') && !message.member.roles.cache.some((r) => r.name === "Giveaways")){
        return message.channel.send('ERR :x: - You need to have the manage messages permissions to end giveaways.');
    }

    if(!args[0]){
        return message.channel.send('ERR :x: - Please specify a valid giveaway ID');
    }

    let giveaway = 
    client.giveawaysManager.giveaways.find((g) => g.prize === args.join(' ')) ||
    client.giveawaysManager.giveaways.find((g) => g.messageID === args[0]);

    if(!giveaway){
        return message.channel.send('ERR :x: - Unable to find a giveaway for `'+ args.join(' ') + '`.');
    }

    client.giveawaysManager.edit(giveaway.messageID, {
        setEndTimestamp: Date.now()
    })
    .then(() => {
        message.channel.send('Giveaway will end in less than '+(client.giveawaysManager.options.updateCountdownEvery/1000)+' seconds...');
    })
    .catch((e) => {
        if(e.startsWith(`Giveaway with given ID ${giveaway.messageID} has already ended.`)){
            message.channel.send('This giveaway has already ended!');
        } else {
            console.error(e);
            message.channel.send('This giveaway has already ended!');
        }
    });

}
}