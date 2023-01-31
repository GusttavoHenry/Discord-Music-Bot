const { CommandInteraction } = require("discord.js");
const AKIRA = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "play",
  description: `Toco a musica que vc quiser! é só digitar o nome ou o link dela 😉`,
  userPermissions: ["CONNECT"],
  botPermissions: ["CONNECT"],
  category: "Music",
  cooldown: 5,
  type: "CHAT_INPUT",
  inVoiceChannel: true,
  inSameVoiceChannel: true,
  Player: false,
  djOnly: false,
  options: [
    {
      name: "song",
      description: `Musica Nome/Link`,
      type: "STRING",
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
    let song = interaction.options.getString("song");
    let { channel } = interaction.member.voice;
    client.distube.play(channel, song, {
      member: interaction.member,
      textChannel: interaction.channel,
    });
    interaction
      .followUp({
        content: `Um minuto, vou procurar pela musica: \`${song}\` Aqui rapidinho`,
        ephemeral: true,
      })
      .then((msg) => {
        setTimeout(() => {
          msg.delete().catch((e) => {})
        }, 3000);
      });
  },
};
