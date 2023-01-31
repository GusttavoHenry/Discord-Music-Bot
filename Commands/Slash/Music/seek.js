const { CommandInteraction } = require("discord.js");
const AKIRA = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "seek",
  description: `Procuarar a musica atual`,
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
      name: "amount",
      description: `Dê a quantidade de busca em número`,
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
    let seek = interaction.options.getNumber("amount")
    await queue.seek(seek);
    client.embed(
      interaction,
      `${client.config.emoji.SUCCESS} Procurando por: \`${seek}\` Segundos !!`
    );
  },
};
