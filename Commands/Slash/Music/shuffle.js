const { CommandInteraction } = require("discord.js");
const AKIRA = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "shuffle",
  description: `toggle shuffle/unshuffle queue`,
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
      name: "mode",
      description: `Deixa as musicas da faixa atual no modo aletorio`,
      type: "STRING",
      required: true,
      choices: [
        {
          name: `Shuffle`,
          value: `yes`,
        },
        {
          name: `UnShuffle`,
          value: `no`,
        },
      ],
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
    let mode = interaction.options.get("mode")?.value;
    if (mode === "yes") {
      client.shuffleData.set(`shuffle-${queue.id}`, queue.songs.slice(1));
      queue.shuffle();
      client.embed(
        interaction,
        `${client.config.emoji.SUCCESS} A faixa: ${queue.songs.length} esta no modo aleatorio !! !!`
      );
    } else if (mode === "no") {
      if (!client.shuffleData.has(`shuffle-${queue.id}`)) {
        return client.embed(
          interaction,
          `${client.config.emoji.ERROR} Nenhuma fila de preenchimento encontrada !!`
        );
      } else {
        const shuffleData = client.shuffleData.get(`shuffle-${queue.id}`);
        queue.songs = [queue.songs[0], ...shuffleData];
        client.shuffleData.delete(`shuffle-${queue.id}`);
        client.embed(
          interaction,
          `${client.config.emoji.SUCCESS} A faixa; ${queue.songs.length} não esta mais no modo aleatorio !!`
        );
      }
    }
  },
};
