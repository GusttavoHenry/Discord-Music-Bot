const { CommandInteraction } = require("discord.js");
const AKIRA = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "volume",
  description: `Muda o volume da faixa atual`,
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
      description: `Ceto, me diga em quantos % vc quer que eu aumente o volume?`,
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
    let volume = interaction.options.getNumber("amount");
    if (volume > 250) {
      return client.embed(
        interaction,
        `${client.config.emoji.ERROR} eu posso aumentar o som entre 1 e 250 %, mas te recomendo deixar em 70%!`
      );
    } else {
      await queue.setVolume(volume);
      client.embed(
        interaction,
        `${client.config.emoji.SUCCESS} O volume esta em ${queue.volume}% !!`
      );
    }
  },
};
