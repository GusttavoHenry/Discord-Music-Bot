const { CommandInteraction } = require("discord.js");
const AKIRA = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "reset",
  description: `reseta para as configurações padrão`,
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
    await client.music.delete(interaction.guildId)
    client.embed(interaction,`${client.config.emoji.SUCCESS} Reset feito !!`)
  },
};
