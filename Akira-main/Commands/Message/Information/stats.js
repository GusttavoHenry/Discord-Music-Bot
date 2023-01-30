const { Message, EmbedBuilder, version } = require("discord.js");
const AKIRA = require("../../../handlers/Client");
const { Queue } = require("distube");
let os = require("os");
let cpuStat = require("cpu-stat");
const { msToDuration } = require("../../../handlers/functions");

module.exports = {
  name: "stats",
  aliases: ["botinfo"],
  description: `Veja o status do bot`,
  userPermissions: ["SEND_MESSAGES"],
  botPermissions: ["EMBED_LINKS"],
  category: "Information",
  cooldown: 5,
  inVoiceChannel: false,
  inSameVoiceChannel: false,
  Player: false,
  djOnly: false,

  /**
   *
   * @param {AKIRA} client
   * @param {Message} message
   * @param {String[]} args
   * @param {String} prefix
   * @param {Queue} queue
   */
  run: async (client, message, args, prefix, queue) => {
    // Code
    cpuStat.usagePercent(function (err, percent, seconds) {
      message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.embed.color)
            .setAuthor({
              name: client.user.username,
              iconURL: client.user.displayAvatarURL({ dynamic: true }),
            })
            .setTitle("__**Stats:**__")
            .addFields([
              {
                name: `⏳ Uso De Memoria`,
                value: `\`${(
                  process.memoryUsage().heapUsed /
                  1024 /
                  1024
                ).toFixed(2)}\` / \`${(os.totalmem() / 1024 / 1024).toFixed(
                  2
                )} MB\``,
              },
              {
                name: `⏱ Uptime`,
                // value: `<t:${Math.floor(
                //   Date.now() / 1000 - client.uptime / 1000
                // )}:R>`,
                value: `\`${msToDuration(client.uptime)}\``,
              },
              {
                name: `📁 Usuarios`,
                value: `\`${client.users.cache.size} \``,
                inline: true,
              },
              {
                name: `📁 Servidores`,
                value: `\`${client.guilds.cache.size}\``,
                inline: true,
              },
              {
                name: `📁 Canais`,
                value: `\`${client.channels.cache.size}\``,
                inline: true,
              },
              {
                name: `👾 Discord.JS`,
                value: `\`v${version}\``,
                inline: true,
              },
              {
                name: `🤖 Node`,
                value: `\`${process.version}\``,
                inline: true,
              },
              {
                name: `📌 Ping`,
                value: `\`${client.ws.ping}ms\``,
                inline: true,
              },
              {
                name: `🤖 CPU`,
                value: `\`\`\`md\n${
                  os.cpus().map((i) => `${i.model}`)[0]
                }\`\`\``,
              },
              {
                name: `🤖 Uso de CPU `,
                value: `\`${percent.toFixed(2)}%\``,
                inline: true,
              },
              {
                name: `🤖 Arco`,
                value: `\`${os.arch()}\``,
                inline: true,
              },
              {
                name: `💻 Platforma`,
                value: `\`\`${os.platform()}\`\``,
                inline: true,
              },
            ])
            .setFooter(client.getFooter(message.author)),
        ],
      });
    });
  },
};
