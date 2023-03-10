const { Message } = require("discord.js");
const AKIRA = require("../../../handlers/Client");
const { Queue } = require("distube");
const { PREFIX } = require("../../../settings/config");

module.exports = {
  name: "prefix",
  aliases: ["prefix", "setprefix"],
  description: `alterar prefixo do servidor atual`,
  userPermissions: ["MANAGE_GUILD"],
  botPermissions: ["MANAGE_GUILD"],
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
    let options = args[0];
    switch (options) {
      case "set":
        {
          let nPrefix = args[1];
          if (!nPrefix) {
            return client.embed(
              message,
              `${client.config.emoji.ERROR} Forneça um novo prefixo`
            );
          } else {
            await client.music.set(`${message.guildId}.prefix`, nPrefix);
            client.embed(
                message,
                `${client.config.emoji.SUCCESS} Prefixo atualizado para: \`${nPrefix}\``
              );
          }
        }
        break;
      case "reset":
        {
            await client.music.set(`${message.guildId}.prefix`, PREFIX);
            client.embed(
                message,
                `${client.config.emoji.SUCCESS} Prefixo atualizado para: \`${PREFIX}\``
              );
        }
        break;

      default:
        {
          client.embed(
            message,
            `** ${client.config.emoji.ERROR} Wrong Usage **  \n\n \`${prefix}prefix set <newprefix>\` \n\n \`${prefix}prefix reset\` `
          );
        }
        break;
    }
  },
};
