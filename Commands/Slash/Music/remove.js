const { CommandInteraction } = require("discord.js");
const AKIRA = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "remove",
  description: `remover uma música da faixa atual`,
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
      description: `Me diga alguma informação sobre a musica`,
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
    if (songIndex === 0) {
      return client.embed(
        interaction,
        `** ${client.config.emoji.ERROR} Você não pode remover a música atual **`
      );
    } else {
      let track = queue.songs[songIndex];
      queue.songs.splice(track, track + 1);
      client.embed(
        interaction,
        `${client.config.emoji.SUCCESS} A musica: \`${track.name}\` foi removida da fila !!`
      );
    }
  },
};
