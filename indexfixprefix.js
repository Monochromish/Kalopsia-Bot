const Discord = require("discord.js");
const client = new Discord.Client();
const db = require('quick.db')
client.mongoose = require('./utils/mongoose');
const { Client, Collection } = require('discord.js');
const { config } = require('dotenv');
const fs = require('fs');
const Distube = require("distube");
const mongoose = require('mongoose');
client.commands = new Collection();
client.aliases = new Collection();
client.mongoose = require('./utils/mongoose');

client.categories = fs.readdirSync('./commands/');

config({
  path: `${__dirname}/.env`
});

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
  console.log(`✔️ Комманды Загружены - ${command.name} `);
}
client.on('ready', () => {
  const mongo_url = process.env.mongo_url;
  console.log("Успех - Бот запустился");

  mongoose.connect(mongo_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(console.log("Успех - Бот Подключился к MongoDB"));
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
    name: `Комманды | ${prefix}help | Bot Made By NOVA`,//You can also change name to whatever you want the bot to say on the status
  })
})

const status = (queue) =>
  `Звук: \`${queue.volume}%\` | Фильтр: \`${queue.filter || "Откл"
  }\` | Петля: \`${queue.repeatMode
    ? queue.repeatMode == 2
      ? "Все Песни"
      : "Эта Песня"
    : "Откл"
  }\` | Автовоспроизведение: \`${queue.autoplay ? "Вкл" : "Откл"}\``;

client.distube
  .on("playSong", (message, queue, song) => {
    const playSongEmbed = new Discord.MessageEmbed()
      .setTitle('Играет Песня')
      .setDescription(`[${song.name}](${song.url})`)
      .addField('**Просмотров:**', song.views)
      .addField('**Продолжительность:**', song.formattedDuration)
      .addField('**Статус**', status(queue))
      .setThumbnail(song.thumbnail)
      .setColor("RED")
    message.channel.send(playSongEmbed)
  })
  .on("addSong", (message, queue, song) =>
    message.channel.send(
      ` ✅ Добавленно ${song.name} - \`${song.formattedDuration}\` в очередь ${song.user}`
    )
  )
  .on("playList", (message, queue, playlist, song) =>
    message.channel.send(
      ` ✅ Игратет \`${playlist.title}\` плэйлист (${playlist.total_items
      } песен).\nЗапрошено: ${song.user}\nСейчас играет \`${song.name}\` - \`${song.formattedDuration
      }\`\n${status(queue)}`
    )
  )
  .on("addList", (message, queue, playlist) =>
    message.channel.send(
      ` ✅ Добавлен \`${playlist.title}\` плэйлист (${playlist.total_items
      } музыки) для очереди\n${status(queue)}`
    )
  )
  .on("error", (message, err) =>
    message.channel.send(
      `❌ Ошибка : ${err}`
    )
  );
  client.mongoose.init();
client.login(process.env.token);
