const ms = require('ms');

module.exports = {
    name: 'reroll',
    description: "Reroll Giveaways",
    usage: "[prefix]reroll <giveawayID>",
    aliases: ["reroll"],
    run: async(client, message, args) => {

    if(!message.member.hasPermission('MANAGE_MESSAGES') && !message.member.roles.cache.some((r) => r.name === "Giveaways")){
        return message.channel.send(':x: You need to have the manage messages permissions to reroll giveaways.');
    }

    if(!args[0]){
        return message.channel.send('ERR :x: - Please specify a valid giveaway ID');
    }

    let giveaway = 
    client.giveawaysManager.giveaways.find((g) => g.prize === args.join(' ')) ||
    client.giveawaysManager.giveaways.find((g) => g.messageID === args[0]);

    if(!giveaway){
        return message.channel.send('Unable to find a giveaway for `'+ args.join(' ') +'`.');
    }

    client.giveawaysManager.reroll(giveaway.messageID)
    .then(() => {
        message.channel.send('Giveaway has been rerolled');
    })
    .catch((e) => {
        if(e.startsWith(`Giveaway with message ID ${giveaway.messageID} has not ended yet.`)){
            message.channel.send('Please wait for the giveaway to end');
        } else {
            console.error(e);
            message.channel.send('Please wait for the giveaway to end');
        }
    });

}
}