const { CommandInteraction, EmbedBuilder } = require("discord.js");
const AKIRA = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "nowplaying",
  description: `Musica do momento`,
  userPermissions: ["CONNECT"],
  botPermissions: ["CONNECT"],
  category: "Music",
  cooldown: 5,
  type: "CHAT_INPUT",
  inVoiceChannel: false,
  inSameVoiceChannel: false,
  Player: true,
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
    let song = queue.songs[0];

    interaction.followUp({
      embeds: [
        new EmbedBuilder()
          .setColor(client.config.embed.color)
          .setThumbnail(song.thumbnail)
          .setAuthor({
            name: `Tocando agora 🎶`,
            iconURL: song.thumbnail,
            url: song.url,
          })
          .setDescription(`** [${song.name}](${song.streamURL}) **`)
          .addFields([
            {
              name: `** Duração **`,
              value: ` \`${queue.formattedCurrentTime}/${song.formattedDuration} \``,
              inline: true,
            },
            {
              name: `** Pedido por: **`,
              value: ` \`${song.user.tag} \``,
              inline: true,
            },
            {
              name: `** Autor **`,
              value: ` \`${song.uploader.name}\``,
              inline: true,
            },
          ])
          .setFooter(client.getFooter(interaction.user)),
      ],
    });
  },
};
