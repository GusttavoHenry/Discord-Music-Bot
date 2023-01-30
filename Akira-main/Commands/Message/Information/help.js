const {
  Message,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
} = require("discord.js");
const AKIRA = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "help",
  aliases: ["h", "cmds", "commands"],
  description: `Prescisando de ajuda? veja meus comandos 😉`,
  userPermissions: [],
  botPermissions: ["EMBED_LINKS"],
  category: "Information",
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

    const emoji = {
      Information: "📌",
      Music: "🎶",
      Settings: "⚙️",
    };

    let allcommands = client.mcommands.size;
    let allguilds = client.guilds.cache.size;
    let botuptime = `<t:${Math.floor(
      Date.now() / 1000 - client.uptime / 1000
    )}:R>`;

    let raw = new ActionRowBuilder().addComponents([
      new StringSelectMenuBuilder()
        .setCustomId("help-menu")
        .setPlaceholder(`Clique aqui para ir ao menu principal`)
        .addOptions(
          [
            {
              label: `Menu`,
              value: "home",
              emoji: `🏠`,
              description: `Clique aqui para ir ao menu principal`,
            },
            client.mcategories.map((cat) => {
              return {
                label: `${cat.toLocaleUpperCase()}`,
                value: cat,
                emoji: emoji[cat],
                description: `Clique para ver os comandos de ${cat}`,
              };
            }),
          ].flat(Infinity)
        ),
    ]);

    let help_embed = new EmbedBuilder()
      .setColor(client.config.embed.color)
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(
        `**  É hora do show baby!, Toco qualquer musica que vc quiser!, tudo que vc prescisa fazer é me chamar atravéz do meu comando a!, que eu dou uma animada aqui no servidor!**`
      )
      .addFields([
        {
          name: `Status`,
          value: `>>> ** :gear: \`${allcommands}\` Comandos \n :file_folder: \`${allguilds}\` Servidores \n ⏱ ${botuptime} Uptime \n 🪁 \`${client.ws.ping}\` Ping \n  Feito por [\` Gusttavo Henry \`](#) **`,
        },
      ])
      .setFooter(client.getFooter(message.author));

    let main_msg = await message.reply({
      embeds: [help_embed],
      components: [raw],
    });

    let filter = (i) => i.user.id === message.author.id;
    let colector = await main_msg.createMessageComponentCollector({
      filter: filter,
      time: 60000,
    });
    colector.on("collect", async (i) => {
      if (i.isStringSelectMenu()) {
        await i.deferUpdate().catch((e) => {});
        if (i.customId === "help-menu") {
          let [directory] = i.values;
          if (directory == "home") {
            main_msg.edit({ embeds: [help_embed] }).catch((e) => {});
          } else {
            main_msg
              .edit({
                embeds: [
                  new EmbedBuilder()
                    .setColor(client.config.embed.color)
                    .setTitle(
                      `${emoji[directory]} ${directory} Comandos ${emoji[directory]}`
                    )
                    .setDescription(
                      `>>> ${client.mcommands
                        .filter((cmd) => cmd.category === directory)
                        .map((cmd) => {
                          return `\`${cmd.name}\``;
                        })
                        .join(" ' ")}`
                    )
                    .setFooter(client.getFooter(message.author)),
                ],
              })
              .catch((e) => null);
          }
        }
      }
    });

    colector.on("end", async (c, i) => {
      raw.components.forEach((c) => c.setDisabled(true));
      main_msg.edit({ components: [raw] }).catch((e) => {});
    });
  },
};
