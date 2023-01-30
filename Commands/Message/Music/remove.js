const { Message } = require("discord.js");
const AKIRA = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "remove",
  aliases: ["rem", "remsong"],
  description: `remover uma música da faixa atual`,
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
    let songIndex = Number(args[0]);
    if (!songIndex) {
      return client.embed(
        message,
        `** ${
          client.config.emoji.ERROR
        }  Hummm...Acho que não entndi!, por favor, me dê mais informações sobre a música \`0\`-\`${
          queue.songs.length - 1
        }\`**`
      );
    } else if (songIndex === 0) {
      return client.embed(
        message,
        `** ${client.config.emoji.ERROR} No momento você não pode remover a musica atual!! **`
      );
    } else {
      let track = queue.songs[songIndex];
      queue.songs.splice(track, track + 1);
      client.embed(
        message,
        `${client.config.emoji.SUCCESS} A musica \`${track.name}\` foi removida da fila !!`
      );
    }
  },
};
