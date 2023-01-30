const { Message, EmbedBuilder } = require("discord.js");
const AKIRA = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "nowplaying",
  aliases: ["np"],
  description: `Musica do momento`,
  userPermissions: ["CONNECT"],
  botPermissions: ["CONNECT"],
  category: "Music",
  cooldown: 5,
  inVoiceChannel: false,
  inSameVoiceChannel: false,
  Player: true,
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
    let song = queue.songs[0];
    
    message.reply({
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
          .setFooter(client.getFooter(message.author)),
      ],
    });
  },
};
