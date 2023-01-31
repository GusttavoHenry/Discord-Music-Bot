const { CommandInteraction } = require("discord.js");
const AKIRA = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "resume",
  description: `Retomar a música pausada na fila`,
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
    if (queue.paused) {
      queue.resume();
      client.embed(
        interaction,
        `${client.config.emoji.SUCCESS} Faixa retomada !!`
      );
    } else {
      client.embed(
        interaction,
        `${client.config.emoji.ERROR} EI!!! A FAIXA JA VOLTOU A TOCAR!!`
      );
    }
  },
};
