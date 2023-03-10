const { Message } = require("discord.js");
const AKIRA = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "autoresume",
  aliases: ["atresume"],
  description: `ativar/desativar o sistema de retomada automática`,
  userPermissions: ["MANAGE_GUILD"],
  botPermissions: ["MANAGE_GUILD"],
  category: "Settings",
  cooldown: 5,
  inVoiceChannel: false,
  inSameVoiceChannel: true,
  Player: false,
  djOnly: false,

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
    let data = await client.music.get(`${message.guild.id}.autoresume`);
    if (data === true) {
      await client.music.set(`${message.guild.id}.autoresume`, false);
      client.embed(
        message,
        `** ${client.config.emoji.ERROR}  Sistema de Autoresume desativado  **`
      );
    } else {
      await client.music.set(`${message.guild.id}.autoresume`, true);
      client.embed(
        message,
        `** ${client.config.emoji.SUCCESS} Sistema de Autoresume ativado  **`
      );
    }
  },
};
