const { Message } = require("discord.js");
const AKIRA = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "jump",
  aliases: ["jmp", "jp"],
  description: `pular para uma música na fila pelo índice`,
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
    let index = Number(args[0]);
    if (!index) {
      return client.embed(
        message,
        `${client.config.emoji.ERROR} Por favor me dia o nome ou o link da musica ok?!`
      );
    }
    let song = queue.songs[index];
    if (index > queue.songs.length - 1 || index < 0) {
      return client.embed(
        message,
        `${
          client.config.emoji.ERROR
        } **A posição deve ser entre  \`0\` e \`${
          queue.songs.length - 1
        }\`!**`
      );
    } else {
      queue.jump(index).then((q) => {
        client.embed(
          message,
          `** ${client.config.emoji.SUCCESS} Pulando para a proxima musica [\`${song.name}\`](${song.url}) **`
        );
      });
    }
  },
};
