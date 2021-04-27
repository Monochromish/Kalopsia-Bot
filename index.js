const Discord = require("discord.js");
require("dotenv").config();
const client = new Discord.Client();
const Distube = require("distube");
const config = require('./config/config.json')
const mongoose = require('mongoose')
const db = require('quick.db')
const fs = require("fs");

client.distube = new Distube(client, {
  searchSongs: false,
  leaveOnFinish: false,
  leaveOnStop: false,
});

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.emotes = config.emoji

function getDirectories() {
  return fs.readdirSync("./commands").filter(function subFolders(file) {
    return fs.statSync("./commands/" + file).isDirectory();
  });
}
const commandFiles = fs
  .readdirSync("./commands/")
  .filter((file) => file.endsWith(".js"));
for (const folder of getDirectories()) {
  const folderFiles = fs
    .readdirSync("./commands/" + folder)
    .filter((file) => file.endsWith(".js"));
  for (const file of folderFiles) {
    commandFiles.push([folder, file]);
  }
}
for (const file of commandFiles) {
  let command;
  if (Array.isArray(file)) {
    command = require(`./commands/${file[0]}/${file[1]}`);
  } else {
    command = require(`./commands/${file}`);
  }

  client.commands.set(command.name, command);
  console.log(`✔️ Command Loaded - ${command.name} `);
}
client.on('ready', () => {
  const mongo_url = process.env.mongo_url;
  console.log("Success - Bot is running");

  mongoose.connect(mongo_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(console.log("Success - Connected to MongoDatabase"));
  const welcome = require('./events&functions/welcome')
  welcome(client)
})

client.on('message', async message => {
  const xp = require('./events&functions/xp')
  if (!message.guild) return;
  const prefix = process.env.prefix;
  xp(message)
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  
  const cmd =
    client.commands.get(command) ||
    client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(command));
  if (cmd) cmd.run(client, message, args);
  let customCommands = db.get(`guildConfigurations_${message.guild.id}.commands`)
  if (customCommands) {
    let customCommandsName = customCommands.find(x => x.name === command)
    if (customCommandsName) return message.channel.send(customCommandsName.response)
  }

  client.user.setActivity({
    type: 'LISTENING',//Here you can change type from LISTENING to WATCHING or STREAMING
    name: `to commands | ${prefix}help | Bot Made By Monochromish`,//You can also change name to whatever you want the bot to say on the status
  })
})

const status = (queue) =>
  `Volume: \`${queue.volume}%\` | Filter: \`${queue.filter || "Off"
  }\` | Loop: \`${queue.repeatMode
    ? queue.repeatMode == 2
      ? "All Queue"
      : "This Song"
    : "Off"
  }\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``;

client.distube
  .on("playSong", (message, queue, song) => {
    const playSongEmbed = new Discord.MessageEmbed()
      .setTitle('Started Playing')
      .setDescription(`[${song.name}](${song.url})`)
      .addField('**Views:**', song.views)
      .addField('**Duration:**', song.formattedDuration)
      .addField('**Status**', status(queue))
      .setThumbnail(song.thumbnail)
      .setColor("RANDOM")
    message.channel.send(playSongEmbed)
  })
  .on("addSong", (message, queue, song) =>
    message.channel.send(
      `${client.emotes.success} | Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`
    )
  )
  .on("playList", (message, queue, playlist, song) =>
    message.channel.send(
      `${client.emotes.play} | Play \`${playlist.title}\` playlist (${playlist.total_items
      } songs).\nRequested by: ${song.user}\nNow playing \`${song.name}\` - \`${song.formattedDuration
      }\`\n${status(queue)}`
    )
  )
  .on("addList", (message, queue, playlist) =>
    message.channel.send(
      `${client.emotes.success} | Added \`${playlist.title}\` playlist (${playlist.total_items
      } songs) to queue\n${status(queue)}`
    )
  )
  .on("error", (message, err) =>
    message.channel.send(
      `${client.emotes.error} | ERR : ${err}`
    )
  );

client.login(process.env.token);