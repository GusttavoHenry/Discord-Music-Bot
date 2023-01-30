const { Message } = require("discord.js");
const AKIRA = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "unshuffle",
  aliases: ["unsfl"],
  description: `desembaralha a faixa no modo aleatorio atual`,
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
    if (!client.shuffleData.has(`shuffle-${queue.id}`)) {
      return client.embed(
        message,
        `${client.config.emoji.ERROR} Nenhuma faixa no modo aleatorio foi encontrada !!`
      );
    } else {
      const shuffleData = client.shuffleData.get(`shuffle-${queue.id}`);
      queue.songs = [queue.songs[0], ...shuffleData];
      client.shuffleData.delete(`shuffle-${queue.id}`);
      client.embed(
        message,
        `${client.config.emoji.SUCCESS} A faixa: ${queue.songs.length} foi retirada do modo aleatorio !!`
      );
    }
  },
};
