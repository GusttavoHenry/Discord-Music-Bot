const { Message } = require("discord.js");
const AKIRA = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "pause",
  aliases: ["pu", "pj"],
  description: `Pausar a musica`,
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
    if (!queue.paused) {
      queue.pause();
      client.embed(message, `${client.config.emoji.SUCCESS} Faixa pausada !!`);
    } else {
      client.embed(
        message,
        `${client.config.emoji.ERROR} EI!, A FAIXA JÁ ESTA PAUSADA !!`
      );
    }
  },
};
