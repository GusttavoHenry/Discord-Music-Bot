const { CommandInteraction } = require("discord.js");
const AKIRA = require("../../../handlers/Client");
const { Queue } = require("distube");
const { swap_pages } = require("../../../handlers/functions");

module.exports = {
  name: "queue",
  description: `Ver a faixa atual`,
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
    if (!queue.songs.length) {
      return client.embed(interaction, `${client.config.emoji.ERROR} Não há nada na fila!!`);
    } else {
      let embeds = await client.getQueueEmbeds(queue);
      await swap_pages(interaction, embeds);
    }
  },
};
