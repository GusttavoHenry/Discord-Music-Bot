const { Message } = require("discord.js");
const AKIRA = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "playskip",
  aliases: ["ps", "pskip"],
  description: `reproduzir a música pulando o nome/link da música atual`,
  userPermissions: ["CONNECT"],
  botPermissions: ["CONNECT"],
  category: "Music",
  cooldown: 5,
  inVoiceChannel: true,
  inSameVoiceChannel: true,
  Player: false,
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
    let song = args.join(" ");
    if (!song) {
      return client.embed(
        message,
        `${client.config.emoji.ERROR} Você precisa me dizer o nome ou link da música`
      );
    } else {
      let { channel } = message.member.voice;
      client.distube.play(channel, song, {
        member: message.member,
        textChannel: message.channel,
        message: message,
        skip: true,
      });
    }
  },
};
