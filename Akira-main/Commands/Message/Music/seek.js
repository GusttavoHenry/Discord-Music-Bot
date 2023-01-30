const { Message } = require("discord.js");
const AKIRA = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "seek",
  aliases: ["sk"],
  description: `Procuarar a musica atual`,
  userPermissions: ["CONNECT"],
  botPermissions: ["CONNECT"],
  category: "Music",
  cooldown: 5,
  inVoiceChannel: true,
  inSameVoiceChannel: true,
  Player: true,
  djOnly: true,

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
    let seek = Number(args[0]);
    if (!seek) {
      return client.embed(message, `Por favor Forneça a duração da musica em segundos`);
    } else {
      queue.seek(seek);
      client.embed(
        message,
        `${client.config.emoji.SUCCESS} Procurando por: \`${seek}\` Segundos !!`
      );
    }
  },
};
