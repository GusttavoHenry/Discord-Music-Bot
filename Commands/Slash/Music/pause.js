const { CommandInteraction } = require("discord.js");
const AKIRA = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "pause",
  description: `Pausar a musica`,
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
    if (!queue.paused) {
        queue.pause();
        client.embed(
          interaction,
          `${client.config.emoji.SUCCESS} Faixa pausada !!`
        );
      } else {
        client.embed(
          interaction,
          `${client.config.emoji.ERROR} EI!, A FAIXA JÁ ESTA PAUSADA !!`
        );
      }
  },
};
