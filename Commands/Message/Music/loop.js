const { Message } = require("discord.js");
const AKIRA = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "loop",
  aliases: ["lp", "lop"],
  description: `alternar fila/música/desativar modo de repetição!`,
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
    let loopmode = args[0];
    let mods = ["song", "s", "queue", "q", "off"];
    if (!mods.includes(loopmode)) {
      return client.embed(
        message,
        `Wrong Usage :: \`\`\`${mods.join(" ' ")}\`\`\``
      );
    }
    if (loopmode === "off") {
      await queue.setRepeatMode(0);
      return client.embed(
        interaction,
        `** ${client.config.emoji.ERROR} Modo de repetição desativado!! **`
      );
    } else if (loopmode === "song" || loopmode === "s") {
      await queue.setRepeatMode(1);
      return client.embed(
        interaction,
        `** ${client.config.emoji.SUCCESS} Modo de repetição Ativado!! **`
      );
    } else if (loopmode === "queue" || loopmode === "q") {
      await queue.setRepeatMode(2);
      return client.embed(
        interaction,
        `** ${client.config.emoji.SUCCESS} Modo de repetição de faixa habilitado!! **`
      );
    }
  },
};
