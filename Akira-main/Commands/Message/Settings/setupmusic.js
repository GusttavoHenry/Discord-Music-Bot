const { Message, ChannelType } = require("discord.js");
const AKIRA = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "setupmusic",
  aliases: ["setmusic", "setup"],
  description: `configurar canal de música no servidor`,
  userPermissions: ["MANAGE_CHANNELS"],
  botPermissions: ["MANAGE_CHANNELS"],
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
    let channel = await client.music.get(`${message.guild.id}.music.channel`);
    let oldChannel = message.guild.channels.cache.get(channel);
    if (oldChannel) {
      return client.embed(
        message,
        `** ${client.config.emoji.ERROR} 
        Canal de solicitação de música já configurado em ${oldChannel} Exclua primeiro e a configure novamente **`
      );
    } else {
      message.guild.channels
        .create({
          name: `${client.user.username}-Pedidos`,
          type: ChannelType.GuildText,
          rateLimitPerUser: 3,
          reason: `Para o Bot de musica`,
          topic: `Canal de solicitação de música para ${client.user.username}, Digite o nome da música ou link para reproduzir a música `,
        })
        .then(async (ch) => {
          await ch
            .send({ embeds: [client.queueembed(message.guild)] })
            .then(async (queuemsg) => {
              await ch
                .send({
                  embeds: [client.playembed(message.guild)],
                  components: [client.buttons(true)],
                })
                .then(async (playmsg) => {
                  await client.music.set(`${message.guild.id}.music`, {
                    channel: ch.id,
                    pmsg: playmsg.id,
                    qmsg: queuemsg.id,
                  });
                  client.embed(
                    message,
                    `${client.config.emoji.SUCCESS} Configuração feita com sucesso no sistema de música em: ${ch}`
                  );
                });
            });
        });
    }
  },
};
