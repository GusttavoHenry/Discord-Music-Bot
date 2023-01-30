const { Message } = require("discord.js");
const AKIRA = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "move",
  aliases: ["mv", "nvs"],
  description: `mover uma música na fila`,
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
    let position = Number(args[1]);
    if (!songIndex || !position) {
      return client.embed(
        message,
        `${client.config.emoji.ERROR} Você esta usando de maneira :: ${prefix}mova <songindex> <targetindex>`
      );
    }
    if (position >= queue.songs.length || position < 0) position = -1;
    if (songIndex > queue.songs.length - 1) {
      return client.embed(
        message,
        ` **A última música na fila tem a seguinte descrição: \`${queue.songs.length}\`**`
      );
    } else if (position === 0) {
      return client.embed(message, `**Não é possível mover uma música antes de reproduzi-la, ok? 😉**`);
    } else {
      let song = queue.songs[songIndex];
      //remove the song
      queue.songs.splice(songIndex);
      //Add it to a specific Position
      queue.addToQueue(song, position);
      client.embed(
        message,
        `📑 Troque a musica: **${
          song.name
        }** para **\`${position}th\`** depois de **_${
          queue.songs[position - 1].name
        }_!**`
      );
    }
  },
};
