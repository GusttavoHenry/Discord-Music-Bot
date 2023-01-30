const { Message } = require("discord.js");
const AKIRA = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "stop",
  aliases: ["st", "destroy"],
  description: `Para a faixa atual por completo`,
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
    queue.stop();
    client.embed(message, `${client.config.emoji.SUCCESS} A musica foi parada !!`);
  },
};
