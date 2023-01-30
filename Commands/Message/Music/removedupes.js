const { Message } = require("discord.js");
const AKIRA = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "removedupes",
  aliases: ["rmdupes", "rmd"],
  description: `remover sons duplicados na fila`,
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
    let tracks = queue.songs;
    const newtracks = [];
    for (let i = 0; i < tracks.length; i++) {
      let exists = false;
      for (j = 0; j < newtracks.length; j++) {
        if (tracks[i].url === newtracks[j].url) {
          exists = true;
          break;
        }
      }
      if (!exists) {
        newtracks.push(tracks[i]);
      }
    }
    //clear the Queue
    queue.delete();
    //now add every not dupe song again
    await newtracks.map((song, index) => {
      queue.addToQueue(song, index);
    });

    client.embed(
      message,
      `** ${client.config.emoji.SUCCESS} As musicas duplicadas 🎧 \`${newtracks.length}\` Foram removidas da fila!! **`
    );
  },
};
