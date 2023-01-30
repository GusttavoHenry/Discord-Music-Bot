const { Message } = require("discord.js");
const AKIRA = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "dj",
  aliases: ["setupdj"],
  description: `Sistema de DJ ligado/desligado`,
  userPermissions: ["MANAGE_GUILD"],
  botPermissions: ["MANAGE_GUILD"],
  category: "Settings",
  cooldown: 5,
  inVoiceChannel: false,
  inSameVoiceChannel: false,
  Player: false,
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
    let options = args[0];
    switch (options) {
      case "enable":
        {
          let role =
            message.mentions.roles.first() ||
            message.guild.roles.cache.get(args[1]);
          if (!role) {
            return client.embed(
              message,
              `${client.config.emoji.ERROR} Forneça um ID de função ou menções`
            );
          } else {
            await client.music.set(`${message.guild.id}.djrole`, role.id);
            client.embed(
              message,
              `${client.config.emoji.SUCCESS} ${role} Função adicionada à função de DJ`
            );
          }
        }
        break;
      case "disable":
        {
          await client.music.set(`${message.guild.id}.djrole`, null);
          client.embed(
            message,
            `${client.config.emoji.SUCCESS} Sistema do DJ Desativado`
          );
        }
        break;
      case "cmds":
        {
          const djcommands = client.mcommands
            .filter((cmd) => cmd?.djOnly)
            .map((cmd) => cmd.name)
            .join(", ");

          client.embed(
            message,
            `**DJ Commandos** \n \`\`\`js\n${djcommands}\`\`\``
          );
        }
        break;

      default:
        {
          client.embed(
            message,
            `** ${client.config.emoji.ERROR} o Uso do comando esta errado **  \n\n \`${prefix}dj ativado <@role>\` \n\n \`${prefix}dj desativado\`  \n\n \`${prefix}dj cmds\` `
          );
        }
        break;
    }
  },
};
