const { CommandInteraction } = require("discord.js");
const AKIRA = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "247",
  description: `ativar/desativar o sistema 24/7`,
  userPermissions: ["MANAGE_GUILD"],
  botPermissions: ["EMBED_LINKS"],
  category: "Settings",
  cooldown: 5,
  type: "CHAT_INPUT",
  inVoiceChannel: true,
  inSameVoiceChannel: true,
  Player: false,
  djOnly: false,

  /**
   *
   * @param {AKIRA} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   * @param {Queue} queue
   */
  run: async (client, interaction, args, queue) => {
    // Code
    let data = await client.music.get(`${interaction.guild.id}.vc`);
    let mode = data.enable;
    let channel = interaction.member.voice.channel;

    if (mode === true) {
      let dataOptions = {
        enable: false,
        channel: null,
      };
      await client.music.set(`${interaction.guild.id}.vc`, dataOptions);
      // if (player) await player.destroy();
      client.embed(
        interaction,
        `** ${client.config.emoji.ERROR}  Sistema 24/7 desativado  **`
      );
    } else {
      let dataOptions = {
        enable: true,
        channel: channel.id,
      };
      await client.music.set(`${interaction.guild.id}.vc`, dataOptions);
      client.embed(
        interaction,
        `** ${client.config.emoji.SUCCESS} Sistema 24/7 ativado**`
      );
    }
  },
};
