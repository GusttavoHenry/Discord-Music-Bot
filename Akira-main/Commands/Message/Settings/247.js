const { Message } = require("discord.js");
const AKIRA = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "247",
  aliases: ["24vc"],
  description: `ativar/desativar o sistema 24/7`,
  userPermissions: ["MANAGE_GUILD"],
  botPermissions: ["MANAGE_GUILD"],
  category: "Settings",
  cooldown: 5,
  inVoiceChannel: true,
  inSameVoiceChannel: true,
  Player: false,
  djOnly: false,

  /**
   *
   * @param {AKIR} client
   * @param {Message} message
   * @param {String[]} args
   * @param {String} prefix
   * @param {Queue} queue
   */
  run: async (client, message, args, prefix, queue) => {
    // Code
    let data = await client.music.get(`${message.guild.id}.vc`);
    let mode = data?.enable;
    let channel = message.member.voice.channel;
    if (mode === true) {
      let dataOptions = {
        enable: false,
        channel: null,
      };
      await client.music.set(`${message.guild.id}.vc`, dataOptions);
      // if (player) await player.destroy();
      client.embed(
        message,
        `** ${client.config.emoji.ERROR}   Sistema 24/7 desativado  **`
      );
    } else {
      let dataOptions = {
        enable: true,
        channel: channel.id,
      };
      await client.music.set(`${message.guild.id}.vc`, dataOptions);
      client.embed(
        message,
        `** ${client.config.emoji.SUCCESS} Sistema 24/7 ativado **`
      );
    }
  },
};
