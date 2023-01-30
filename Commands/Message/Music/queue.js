const { Message } = require("discord.js");
const AKIRA = require("../../../handlers/Client");
const { Queue } = require("distube");
const { swap_pages } = require("../../../handlers/functions");

module.exports = {
  name: "queue",
  aliases: ["q", "list"],
  description: `Ver a faixa atual`,
  userPermissions: ["CONNECT"],
  botPermissions: ["CONNECT"],
  category: "Music",
  cooldown: 5,
  inVoiceChannel: false,
  inSameVoiceChannel: false,
  Player: true,
  djOnly: false,

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
    if (!queue.songs.length) {
      return client.embed(
        message,
        `${client.config.emoji.ERROR} Não há nada na fila!!`
      );
    } else {
      let embeds = await client.getQueueEmbeds(queue);
      await swap_pages(message, embeds);
    }
  },
};
