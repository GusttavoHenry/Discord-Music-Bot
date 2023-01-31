const { CommandInteraction } = require("discord.js");
const AKIRA = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "jump",
  description: `pular para uma música na fila pelo índice`,
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
      name: "index",
      description: `Por favor me diga o nome ou o link da musica ok?!`,
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
    let index = interaction.options.getNumber("index");
    let song = queue.songs[index]
    if (index > queue.songs.length - 1 || index < 0) {
      return client.embed(
        interaction,
        `${
          client.config.emoji.ERROR
        } **A posição deve ser entre \`0\` e\`${
          queue.songs.length - 1
        }\`!**`
      );
    } else {
      queue.jump(index).then((q) => {
        client.embed(
          interaction,
          `** ${client.config.emoji.SUCCESS} Ok, Pulando para a proxima musica: [\`${song.name}\`](${song.url}) **`
        );
      });
    }
  },
};
