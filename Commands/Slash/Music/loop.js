const { CommandInteraction } = require("discord.js");
const AKIRA = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "loop",
  description: `Alternar fila/música/desativar modo de repetição!`,
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
      name: "loopmode",
      description: `Escolha um modo de repetição`,
      type: "STRING",
      required: true,
      choices: [
        {
          name: "musica",
          value: `1`,
        },
        {
          name: "Faixa",
          value: `2`,
        },
        {
          name: "Off",
          value: `0`,
        },
      ],
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
    let loopmode = Number(interaction.options.getString("loopmode"));
    await queue.setRepeatMode(loopmode);
    if (queue.repeatMode === 0) {
      return client.embed(
        interaction,
        `** ${client.config.emoji.ERROR} Modo de repetição desativado!! **`
      );
    } else if (queue.repeatMode === 1) {
      return client.embed(
        interaction,
        `** ${client.config.emoji.SUCCESS} Modo de repetição Ativado!! **`
      );
    } else if (queue.repeatMode === 2) {
      return client.embed(
        interaction,
        `** ${client.config.emoji.SUCCESS} Modo de repetição de faixa habilitado!! **`
      );
    }
  },
};
