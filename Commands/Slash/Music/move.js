const { CommandInteraction } = require("discord.js");
const AKIRA = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "move",
  description: `Mover uma música na fila`,
  userPermissions: ["CONNECT"],
  botPermissions: ["CONNECT"],
  category: "Music",
  cooldown: 5,
  type: "CHAT_INPUT",
  inVoiceChannel: true,
  inSameVoiceChannel: true,
  Player: true,
  djOnly: true,
  options: [
    {
      name: "trackindex",
      description: `info sobre a musica`,
      type: "NUMBER",
      required: true,
    },
    {
      name: "targetindex",
      description: `Índice de música de destino`,
      type: "NUMBER",
      required: true,
    },
  ],

  /**
   *
   * @param {AKIRA} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   * @param {Queue} queue
   */
  run: async (client, interaction, args, queue) => {
    // Code
    let songIndex = interaction.options.getNumber("trackindex");
    let position = interaction.options.getNumber("targetindex");
    if (position >= queue.songs.length || position < 0) position = -1;
    if (songIndex > queue.songs.length - 1) {
      return client.embed(
        interaction,
        ` **A última música na fila tem a seguinte descrição: \`${queue.songs.length}\`**`
      );
    } else if (position === 0) {
      return client.embed(
        interaction,
        `**Não é possível mover uma música antes de reproduzi-la, ok? 😉**`
      );
    } else {
      let song = queue.songs[songIndex];
      //remove the song
      queue.songs.splice(songIndex);
      //Add it to a specific Position
      queue.addToQueue(song, position);
      client.embed(
        interaction,
        `📑 A musica: **${
          song.name
        }** ira para **\`${position}th\`** depois de **_${
          queue.songs[position - 1].name
        }_!**`
      );
    }
  },
};
