module.exports = {
    name: "dm",
    description: "DM a user in the guild",
    category: "fun",
    run: async (bot, message, args) => {
      let user =
        message.mentions.members.first() ||
        message.guild.members.cache.get(args[0]);
      if (!user)
        return message.channel.send(
          `You did not mention a user, or you gave an invalid ID`
        );
      if (!args.slice(1).join(" "))
        return message.channel.send("Please specify your message");
      user.user
        .send(args.slice(1).join(" "))
        .catch(() => message.channel.send("ERR :x: - I was unable to DM that user, could be because they have closed their DMs or blocked me :("))
        .then(() => message.channel.send(`Sent a message to ${user.user.tag}`));
    },
  };