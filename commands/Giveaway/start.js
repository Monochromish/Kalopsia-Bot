const ms = require('ms');

module.exports = {
    name: 'start',
    description: "Host Giveaways",
    usage: "[prefix]start <channel> <duration> <no.winners> <prize>",
    aliases: ["host", "start", "giveaway"],
    run: async(client, message, args) => {

    if(!message.member.hasPermission('MANAGE_MESSAGES')){
        return message.channel.send(':x: You need to have the manage messages permissions to host giveaways.');
    }

    let giveawayChannel = message.mentions.channels.first();
    if(!giveawayChannel){
        return message.channel.send('ERR :x: - Please Specify a Channel');
    }

    let giveawayDuration = args[1];
    if(!giveawayDuration || isNaN(ms(giveawayDuration))){
        return message.channel.send('ERR :x: - Please Specify Duration, Example : 30s, 1m, 12h');
    }

    let giveawayNumberWinners = args[2];
    if(isNaN(giveawayNumberWinners) || (parseInt(giveawayNumberWinners) <= 0)){
        return message.channel.send('ERR :x: - Please Specify Number of Winners, Example : 1, 2, 5');
    }

    let giveawayPrize = args.slice(3).join(' ');
    if(!giveawayPrize){
        return message.channel.send('ERR :x: - Please Specify Prize, Example : Nitro, Steam Giftcard, Spotify Premium');
    }

    client.giveawaysManager.start(giveawayChannel, {
        time: ms(giveawayDuration),
        prize: giveawayPrize,
        winnerCount: giveawayNumberWinners,
        hostedBy: message.author.username,
        messages: {
            giveaway: "🎊 **Giveaway Time !** 🎊",
            giveawayEnded: " **Giveaway Has Ended** ",
            timeRemaining: "Time remaining: **{duration}**!",
            inviteToParticipate: "React with 🎉 to participate!",
            winMessage: "Congratulations {winners}! You have won **{prize}**!",
            noWinner: "No valid participations or giveaway was ended",
            hostedBy: "Hosted by: {user}",
            winners: "winner(s)",
            endedAt: "Ended at",
            units: {
                seconds: "seconds",
                minutes: "minutes",
                hours: "hours",
                days: "days",
                pluralS: false
            }
        }
    });

    message.channel.send(`Giveaway started in ${giveawayChannel}!`);
    }
};