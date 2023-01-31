const { CommandInteraction } = require("discord.js");
const AKIRA = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "playprevious",
  description: `reproduzir a música anterior da fila`,
  userPermissions: ["CONNECT"],
  botPermissions: ["CONNECT"],
  category: "Music",
  cooldown: 5,
  type: "CHAT_INPUT",
  inVoiceChannel: true,
  inSameVoiceChannel: true,
  Player: true,
  djOnly: true,

  /**
   *
   * @param {AKIRA} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   * @param {Queue} queue
   */
  run: async (client, interaction, args, queue) => {
    // Code
    if (!queue.previousSongs.length) {
      return client.embed(
        interaction,
        `${client.config.emoji.ERROR} Gomen, não consegui achar a musica anterior 😑 !!`
      );
    } else {
      await queue.previous().then((m) => {
        client.embed(
          interaction,
          `${client.config.emoji.SUCCESS}  Mais uma vez?, OK! vou repetir a musica O(∩_∩)O`
        );
      });
    }
  },
};
