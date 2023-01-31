const { CommandInteraction } = require("discord.js");
const AKIRA = require("../../../handlers/Client");
const { Queue } = require("distube");
const { links } = require("../../../settings/config");

module.exports = {
  name: "invite",
  description: `Me adicina ae! é só pegar meu convite 😊 !!`,
  userPermissions: ["SEND_MESSAGES"],
  botPermissions: ["EMBED_LINKS"],
  category: "Information",
  cooldown: 5,
  type: "CHAT_INPUT",
  inVoiceChannel: false,
  inSameVoiceChannel: false,
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
    client.embed(
        interaction,
        `[\`Clique aqui para me adicionar\`](${links.inviteURL.replace(
          "BOTID",
          client.user.id
        )})`
      );
  },
};
