const {
  Message,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  EmbedBuilder,
} = require("discord.js");
const AKIRA = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "filter",
  aliases: ["fl", "filters"],
  description: `Definir filtro na fila por nome`,
  userPermissions: ["CONNECT"],
  botPermissions: ["CONNECT"],
  category: "Music",
  cooldown: 5,
  inVoiceChannel: true,
  inSameVoiceChannel: true,
  Player: true,
  djOnly: true,

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

    const filters = Object.keys(client.config.filters);

    const row = new ActionRowBuilder().addComponents([
      new StringSelectMenuBuilder()
        .setCustomId("filter-menu")
        .setPlaceholder("Click To Select Filter ..")
        .addOptions(
          [
            {
              label: `Off`,
              description: `Clique para desabilitar o filtro`,
              value: "off",
            },
            filters
              .filter((_, index) => index <= 22)
              .map((value) => {
                return {
                  label: value.toLocaleUpperCase(),
                  description: `Clique para definir um ${value} Filtro`,
                  value: value,
                };
              }),
          ].flat(Infinity)
        ),
    ]);

    let msg = await message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.config.embed.color)
          .setTitle(`Select To Enable Filters ...`)
          .setFooter(client.getFooter(message.author))
          .setDescription(
            `> Clique no menu suspenso abaixo e selecione um filtro para adicionar um filtro a fila!!`
          ),
      ],
      components: [row],
    });
    const collector = await msg.createMessageComponentCollector({
      // filter: (i) => i.user.id === message.author.id,
      time: 60000 * 10,
    });
    collector.on("collect", async (interaction) => {
      if (interaction.isStringSelectMenu()) {
        await interaction.deferUpdate().catch((e) => {});
        if (interaction.customId === "filter-menu") {
          if (interaction.user.id !== message.author.id) {
            return interaction.followUp({
              content: `Você não é o autor desta interação!`,
              ephemeral: true,
            });
          }
          let filter = interaction.values[0];
          if (filter === "off") {
            queue.filters.clear();
            interaction.followUp({
              content: `${client.config.emoji.SUCCESS} Filtro de Fila Desativado!!`,
              ephemeral: true,
            });
          } else {
            if (queue.filters.has(filter)) {
              queue.filters.remove(filter);
            } else {
              queue.filters.add(filter);
            }
            interaction.followUp({
              content: `${
                client.config.emoji.SUCCESS
              } | Current Queue Filter: \`${queue.filters.names.join(", ")}\``,
              ephemeral: true,
            });
          }
        }
      }
    });
  },
};
