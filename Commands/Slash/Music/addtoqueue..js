const { ContextMenuInteraction } = require("discord.js");
const AKIRA = require("../../../handlers/Client");

module.exports = {
  name: "addtoqueue",
  type: "MESSAGE",

  /**
   *
   * @param {AKIRA} client
   * @param {ContextMenuInteraction} interaction
   */
  run: async (client, interaction) => {
    // Code
    let msg = await interaction.channel.messages.fetch(interaction.targetId);
    let song =
      msg.cleanContent || msg.embeds[0].description || msg.embeds[0].title;
    let voiceChannel = interaction.member.voice.channel;
    let botChannel = interaction.guild.members.me.voice.channel;
    if (!msg || !song) {
      return client.embed(
        interaction,
        `${client.config.emoji.ERROR} Gomem 😕, não consegui achar a musica`
      );
    } else if (!voiceChannel) {
      return client.embed(
        interaction,
        `${client.config.emoji.ERROR} Você prescisa estar em um canal de voz primeiro`
      );
    } else if (botChannel && !botChannel?.equals(voiceChannel)) {
      return client.embed(
        interaction,
        `${client.config.emoji.ERROR} Você prescisa estar em um ${botChannel}  canal de voz primeiro`
      );
    } else {
      client.distube.play(voiceChannel, song, {
        member: interaction.member,
        textChannel: interaction.channel,
      });
      return client.embed(
        interaction,
        `${client.config.emoji.SUCCESS} Ok, vou procurar por \`${song}\` na web, um momento`
      );
    }
  },
};
