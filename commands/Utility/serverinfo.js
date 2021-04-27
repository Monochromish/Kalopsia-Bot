const { MessageEmbed } = require('discord.js');
const moment = require('moment');


const filterLevels = {
    DISABLED: 'Off',
    MEMBERS_WITHOUT_ROLES: 'No Role',
    ALL_MEMBERS: 'Everyone'
};

const verificationLevels = {
    NONE: 'None',
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: 'High',
    VERY_HIGH: 'Very High'
};

const regions = {
    brazil: 'Brazil',
    europe: 'Europe',
    hongkong: 'Hong Kong',
    india: 'India',
    japan: 'Japan',
    russia: 'Russia',
    singapore: 'Singapore',
    southafrica: 'South Africa',
    sydeny: 'Sydeny',
    'us-central': 'US Central',
    'us-east': 'US East',
    'us-west': 'US West',
    'us-south': 'US South'
};


module.exports = {
    name: 'serverinfo',
    description: 'Find out info about Guild',
    aliases: ['serverinfo', 'info'],
    run: async(client, message, args) => {

        const roles = message.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString());
        const members = message.guild.members.cache;
        const channels = message.guild.channels.cache;
        const emojis = message.guild.emojis.cache;

        const embed = new MessageEmbed()
            .setDescription(`Guild information for **${message.guild.name}**`)
            .setColor('BLUE')
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .addField('General', [
                `Guild Name : ${message.guild.name}`,
                `Owner of this Guild : ${message.guild.owner.user.tag}`,
                `Region : ${regions[message.guild.region]}`,
                `Boost Tier : ${message.guild.premiumTier ? `Tier ${message.guild.premiumTier}` : 'None'}`,
                `Explicit Filter : ${filterLevels[message.guild.explicitContentFilter]}`,
                `Verification Level : ${verificationLevels[message.guild.verificationLevel]}`,
                `Date Created : ${moment(message.guild.createdTimestamp).format('LT')} ${moment(message.guild.createdTimestamp).format('LL')} ${moment(message.guild.createdTimestamp).fromNow()}`,
                '\u200b'
            ])
            .addField('Member count', [
                `Member Count : ${message.guild.memberCount}`,
                `Humans : ${members.filter(member => !member.user.bot).size}`,
                `Bots : ${members.filter(member => member.user.bot).size}`,
                '\u200b'
            ])          
        message.channel.send(embed);
    }
};

