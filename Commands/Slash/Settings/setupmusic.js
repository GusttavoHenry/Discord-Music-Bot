const { CommandInteraction, ChannelType } = require("discord.js");
const AKIRA = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "setupmusic",
  description: `configurar canal de música no servidor`,
  userPermissions: ["MANAGE_CHANNELS"],
  botPermissions: ["MANAGE_CHANNELS"],
  category: "Settings",
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
    let channel = await client.music.get(
      `${interaction.guild.id}.music.channel`
    );
    let oldChannel = interaction.guild.channels.cache.get(channel);
    if (oldChannel) {
      return client.embed(
        interaction,
        `** ${client.config.emoji.ERROR} Canal de solicitação de música já configurado em ${oldChannel} Exclua primeiro e a configure novamente **`
      );
    } else {
      interaction.guild.channels
        .create({
          name: `${client.user.username}-Pedidos`,
          type: ChannelType.GuildText,
          rateLimitPerUser: 3,
          reason: `Para o bot de musica`,
          topic: `Canal de solicitação de música para ${client.user.username}, Digite o nome da música ou link para reproduzir a música `,
        })
        .then(async (ch) => {
          await ch
            .send({ embeds: [client.queueembed(interaction.guild)] })
            .then(async (queuemsg) => {
              await ch
                .send({
                  embeds: [client.playembed(interaction.guild)],
                  components: [client.buttons(true)],
                })
                .then(async (playmsg) => {
                  await client.music.set(`${interaction.guild.id}.music`, {
                    channel: ch.id,
                    pmsg: playmsg.id,
                    qmsg: queuemsg.id,
                  });
                  client.embed(
                    interaction,
                    `${client.config.emoji.SUCCESS} Configuração feita com sucesso no sistema de música em: ${ch}`
                  );
                });
            });
        });
    }
  },
};
