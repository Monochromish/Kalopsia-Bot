const { MessageEmbed } = require("discord.js")

const userReg = RegExp(/<@!?(\d+)>/)

module.exports = {
    name: 'ban',
    description: "The Almighty BanHammer",
    run: async(client, message, args) => {
        const userID = userReg.test(args[0]) ? userReg.exec(args[0])[1] : [0]
        const mentionedUser = await message.client.users.fetch(userID).catch(() => null)

        if(!message.member.hasPermission('BAN_MEMBERS')) {
            const banerror = new MessageEmbed()
            .setDescription("You Don\'t Have Permissions To Ban Members")
            .setColor('RANDOM')

            return message.channel.send(banerror)
        } else if(!message.guild.me.hasPermission('BAN_MEMBERS')) {
            const banerror2 = new MessageEmbed()
            .setDescription("I Don\'t Have Permissions To Ban Members. Make Sure You Have Given Me Appropriate Permissions")
            .setColor('RANDOM')

            return message.channel.send(banerror2)
        } else if(!mentionedUser) {
            const banerror3 = new MessageEmbed()
            .setDescription("You Need To Mention a Member to Ban")
            .setColor('RANDOM')

            return message.channel.send(banerror3)
        }

        const allBans = await message.guild.fetchBans()

        if(allBans.get(mentionedUser.id)) {
            const banerr = new MessageEmbed()
            .setDescription("The User is Already Banned")
            .setColor('RANDOM')

            return message.channel.send(banerr)
        }

        const mentionedMember = message.guild.members.cache.get(mentionedUser.id)

        if(mentionedMember) {
            const mentionedPosition = mentionedMember.roles.highest.position
            const memberPosition = message.member.roles.highest.position
            const botPosition = message.guild.me.roles.highest.position

            if(memberPosition <= mentionedPosition) {
                const banerr2 = new MessageEmbed()
            .setDescription("You Can Not Ban This Member Because their role is higher/equal to yours")
            .setColor('RANDOM')

            return message.channel.send(banerr2)
            } else if (botPosition <= mentionedPosition) {
                const banerr3 = new MessageEmbed()
            .setDescription("I Can Not Ban This Member Because their role is higher/equal to mine")
            .setColor('RANDOM')

            return message.channel.send(banerr3)
            }
        }

        const reason = args.slice(1).join(' ')

        message.guild.members.ban(mentionedUser.id, {reason: reason})

        const banSuccess = new MessageEmbed()
        .setTitle('Success!')
        .setDescription(`Banned ${mentionedUser} ${reason ? `for **${reason}**` : ''}`)

        message.channel.send(banSuccess)

        
     }
}