const {
  CommandInteraction,
  ApplicationCommandOptionType,
} = require("discord.js");
const AKIRA = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "dj",
  description: `Sistema de DJ ligado/desligado`,
  userPermissions: ["MANAGE_GUILD"],
  botPermissions: ["MANAGE_GUILD"],
  category: "Settings",
  cooldown: 5,
  type: "CHAT_INPUT",
  inVoiceChannel: false,
  inSameVoiceChannel: false,
  Player: false,
  djOnly: false,
  options: [
    {
      name: "enable",
      description: `habilita o sistema dj no seu servidor`,
      type: "SUB_COMMAND",
      options: [
        {
          name: "role",
          description: `mencione um papel para o sistema dj`,
          type: ApplicationCommandOptionType.Role,
          required: true,
        },
      ],
    },
    {
      name: "disable",
      description: `Desabilita o sistema do dj no seu servidor`,
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: "commands",
      description: `mostrar todos os comandos de barra dj
      `,
      type: ApplicationCommandOptionType.Subcommand,
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
    let options = interaction.options.getSubcommand();
    switch (options) {
      case "enable":
        {
          let role = interaction.options.getRole("role");
          await client.music.set(`${interaction.guild.id}.djrole`, role.id);
          client.embed(
            interaction,
            `${client.config.emoji.SUCCESS} ${role} Função adicionada à função de DJ`
          );
        }
        break;
      case "disable":
        {
          await client.music.set(`${interaction.guild.id}.djrole`, null);
          client.embed(
            interaction,
            `${client.config.emoji.SUCCESS} Sistema do DJ Desativado`
          );
        }
        break;
      case "commands":
        {
          const djcommands = client.commands
            .filter((cmd) => cmd?.djOnly)
            .map((cmd) => cmd.name)
            .join(", ");

          client.embed(
            interaction,
            `**DJ Comandos** \n \`\`\`js\n${djcommands}\`\`\``
          );
        }
        break;

      default:
        break;
    }
  },
};
