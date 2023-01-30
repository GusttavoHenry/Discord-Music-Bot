const { Message, EmbedBuilder } = require("discord.js");
const AKIRA = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "config",
  aliases: ["cnf"],
  description: `veja a configuração do servidor atual`,
  userPermissions: [],
  botPermissions: [],
  category: "Settings",
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
    let data = await client.music.get(message.guild.id);

    message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.config.embed.color)
          .setAuthor({
            name: `${message.guild.name} Config`,
            iconURL: message.guild.iconURL({ dynamic: true }),
          })
          .setThumbnail(message.guild.iconURL({ dynamic: true }))
          .addFields([
            {
              name: `Prefix`,
              value: `\`${prefix}\``,
            },
            {
              name: `DJ`,
              value: `${
                data.djrole
                  ? `${client.config.emoji.SUCCESS} \`Ativado\``
                  : `${client.config.emoji.ERROR}  \`Desativado\``
              }`,
            },
            {
              name: `Autoresume`,
              value: `${
                data.autoresume
                  ? `${client.config.emoji.SUCCESS} \`Ativado\``
                  : `${client.config.emoji.ERROR}  \`Desativado\``
              }`,
            },
            {
              name: `24/7`,
              value: `${
                data.vc.enable
                  ? `${client.config.emoji.SUCCESS} \`Ativado\``
                  : `${client.config.emoji.ERROR}  \`Desativado\``
              }`,
            },
            {
              name: `Request Channel`,
              value: `${
                data.music.channel
                  ? `<#${data.music.channel}>`
                  : `${client.config.emoji.ERROR}  \`Desativado\``
              }`,
            },
          ])
          .setFooter(client.getFooter(message.author)),
      ],
    });
  },
};
