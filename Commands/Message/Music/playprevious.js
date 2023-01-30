const { Message } = require("discord.js");
const AKIRA = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "playprevious",
  aliases: ["pp", "playp"],
  description: `reproduzir a música anterior da fila"`,
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
    if (!queue.previousSongs.length) {
      return client.embed(
        message,
        `${client.config.emoji.ERROR} Gomen, não consegui achar a musica anterior 😑 !!`
      );
    } else {
      await queue.previous().then((m) => {
        client.embed(
          message,
          `${client.config.emoji.SUCCESS} Mais uma vez?, OK! vou repetir a musica O(∩_∩)O`
        );
      });
    }
  },
};
