const { Message } = require("discord.js");
const AKIRA = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "volume",
  aliases: ["vol"],
  description: `Muda o volume da faixa atual`,
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
    let volume = Number(args[0]);
    if (!volume) {
      return client.embed(message, `${client.config.emoji.ERROR} Ceto, me diga em quantos % vc quer que eu aumente o volume?`);
    } else if (volume > 250) {
      return client.embed(
        message,
        `${client.config.emoji.ERROR} eu posso aumentar o som entre 1 e 250 %, mas te recomendo deixar em 70%! `
      );
    } else {
      await queue.setVolume(volume);
      client.embed(
        message,
        `${client.config.emoji.SUCCESS} Volume esta em ${queue.volume}% !!`
      );
    }
  },
};
