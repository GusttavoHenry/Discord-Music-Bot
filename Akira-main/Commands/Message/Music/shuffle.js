const { Message } = require("discord.js");
const AKIRA = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "shuffle",
  aliases: ["sfl"],
  description: `Deixa as musicas da faixa atual no modo aletorio`,
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
    client.shuffleData.set(`shuffle-${queue.id}`, queue.songs.slice(1));
    queue.shuffle();
    client.embed(
      message,
      `${client.config.emoji.SUCCESS} A faixa: ${queue.songs.length} esta no modo aleatorio !!`
    );
  },
};
