const { MessageEmbed } = require('discord.js');
const moment = require('moment');


const flags = {
    DISCORD_EMPLOYEE: 'Discord Employee',
    DISCORD_PARTNER: 'Discord Partner',
    BUGHUNTER_LEVEL_1: 'Bug Hunter (Level 1)',
    BUGHUNTER_LEVEL_2: 'Bug Hunter (Level 2)',
    HYPESQUAD_EVENTS: 'HypeSquad Events',
    HOUSE_BRAVERY: 'House of Bravery',
    HOUSE_BRILLIANCE: 'House of Brilliance',
    HOUSE_BALANCE: 'House of Balance',
    EARLY_SUPPORTER: 'Early Supporter',
    TEAM_USER: 'Team User',
    SYSTEM: 'System',
    VERIFIED_BOT: 'Verified Bot',
    VERIFIED_DEVELOPER: 'Verified Bot Developer'
};

module.exports = {
    name: 'userinfo',
    description: 'Find out info about mentioned user',
    aliases: ['userinfo', 'user'],
    run: async(client, message, args) => {

        const member = message.mentions.members.last() || message.member;
        const roles = member.roles.cache
            .sort((a, b) => b.position - a.position)
            .map(role => role.toString())
            .slice(0, -1);
        const userFlags = member.user.flags.toArray();
        const embed = new MessageEmbed()
            .setDescription(`**User Information for ${member.user.username}**`)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
            .setColor(member.displayHexColor || 'BLACK')
            .addField('User', [
                `Username : ${member.user.username}`,
                `Discriminator : ${member.user.discriminator}`,
                `ID : ${member.id}`,
                `Flags : ${userFlags.length ? userFlags.map(flag => flags[flag]).join(', ') : 'None'}`,
                `Avatar : [Click here](${member.user.displayAvatarURL({ dynamic: true })})`,
                `Account Created On : ${moment(member.user.createdTimestamp).format('LT')} ${moment(member.user.createdTimestamp).format('LL')} ${moment(member.user.createdTimestamp).fromNow()}`,
                `\u200b`
            ])
            .addField('Member', [
                `Highest Role : ${member.roles.highest.id === message.guild.id ? 'None' : member.roles.highest.name}`,
                `Server Join Date : ${moment(member.joinedAt).format('LL LTS')}`,
                `Roles [${roles.length}] : ${roles.length < 10 ? roles.join(', ') : roles.length > 10 ? this.client.utils.trimArray(roles) : 'None'}`,
                `\u200b`
            ]);
        return message.channel.send(embed);
    }

}



