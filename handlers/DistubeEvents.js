"use strict";
const {
  EmbedBuilder,
  PermissionFlagsBits,
  ButtonInteraction,
} = require("discord.js");
const AKIRA = require("./Client");
const { Song, SearchResultVideo } = require("distube");
const { check_dj, skip } = require("./functions");
let voiceMap = new Map();

/**
 *
 * @param {AKIRA} client
 */
module.exports = async (client) => {
  client.distube.setMaxListeners(0);

  async function autoresume() {
    if (!client.autoresume) return;
    let guildIds = await client.autoresume.keys;
    if (!guildIds || !guildIds.length) return;
    for (const gId of guildIds) {
      let guild = client.guilds.cache.get(gId);
      if (!guild) await client.autoresume.delete(gId);
      let data = await client.autoresume.get(guild.id);
      if (!data) return;
      let voiceChannel = guild.channels.cache.get(data.voiceChannel);
      if (!voiceChannel && data.voiceChannel)
        voiceChannel =
          (await guild.channels.fetch(data.voiceChannel).catch(() => {})) ||
          false;
      if (
        !voiceChannel ||
        !voiceChannel.members ||
        voiceChannel.members.filter(
          (m) => !m.user.bot && !m.voice.deaf && !m.voice.selfDeaf
        ).size < 1
      ) {
        client.autoresume.delete(gId);
      }
      let textChannel = guild.channels.cache.get(data.textChannel);
      if (!textChannel)
        textChannel =
          (await guild.channels.fetch(data.textChannel).catch(() => {})) ||
          false;
      if (!textChannel) await client.autoresume.delete(gId);
      let tracks = data.songs;
      if (!tracks || !tracks[0]) continue;
      const makeTrack = async (track) => {
        return new Song(
          new SearchResultVideo({
            duration: track.duration,
            formattedDuration: track.formattedDuration,
            id: track.id,
            isLive: track.isLive,
            name: track.name,
            thumbnail: track.thumbnail,
            type: "video",
            uploader: track.uploader,
            url: track.url,
            views: track.views,
          }),
          guild.members.cache.get(track.memberId) || guild.members.me,
          track.source
        );
      };

      await client.distube.play(voiceChannel, tracks[0].url, {
        member: guild.members.cache.get(tracks[0].memberId) || guild.members.me,
        textChannel: textChannel,
      });
      let newQueue = client.distube.getQueue(guild.id);
      for (const track of tracks.slice(1)) {
        newQueue.songs.push(await makeTrack(track));
      }
      await newQueue.setVolume(data.volume);
      if (data.repeatMode && data.repeatMode !== 0) {
        newQueue.setRepeatMode(data.repeatMode);
      }
      if (!data.playing) {
        newQueue.pause();
      }
      await newQueue.seek(data.currentTime);
      if (!data.playing) {
        newQueue.pause();
      }
      await client.autoresume.delete(newQueue.textChannel.guildId);
    }
  }

  client.on("ready", async () => {
    setTimeout(async () => await autoresume(), 2 * client.ws.ping);
  });

  // distube events
  try {
    // events
    client.distube.on("playSong", async (queue, song) => {
      let data = await client.music.get(`${queue.textChannel.guildId}.music`);
      if (data) {
        await client.updatequeue(queue);
        await client.updateplayer(queue);
        if (data.channel === queue.textChannel.id) return;
      }
      queue.textChannel
        .send({
          embeds: [
            new EmbedBuilder()
              .setColor(client.config.embed.color)
              .setDescription(`** [\`${song.name}\`](${song.url}) **`)
              .addFields([
                {
                  name: `Pedido por`,
                  value: `\`${song.user.tag}\``,
                  inline: true,
                },
                {
                  name: `Autor`,
                  value: `\`${song.uploader.name}\``,
                  inline: true,
                },
                {
                  name: `Dura????o`,
                  value: `\`${song.formattedDuration}\``,
                  inline: true,
                },
              ])
              .setFooter(client.getFooter(song.user)),
          ],
          components: [client.buttons(false)],
        })
        .then((msg) => {
          client.temp.set(queue.textChannel.guildId, msg.id);
        });
    });

    client.distube.on("addSong", async (queue, song) => {
      let data = await client.music.get(`${queue.textChannel.guildId}.music`);
      if (data) {
        await client.updatequeue(queue);
        if (data.channel === queue.textChannel.id) return;
      }
      queue.textChannel
        .send({
          embeds: [
            new EmbedBuilder()
              .setColor(client.config.embed.color)
              .setAuthor({
                name: `Adicionar a fila`,
                iconURL: song.user.displayAvatarURL({ dynamic: true }),
                url: song.url,
              })
              .setThumbnail(song.thumbnail)
              .setDescription(`[\`${song.name}\`](${song.url})`)
              .addFields([
                {
                  name: `Pedido por`,
                  value: `\`${song.user.tag}\``,
                  inline: true,
                },
                {
                  name: `Autor`,
                  value: `\`${song.uploader.name}\``,
                  inline: true,
                },
                {
                  name: `Dura????o`,
                  value: `\`${song.formattedDuration}\``,
                  inline: true,
                },
              ])
              .setFooter(client.getFooter(song.user)),
          ],
        })
        .then((msg) => {
          setTimeout(() => {
            msg.delete().catch((e) => null);
          }, 5000);
        });
    });

    client.distube.on("addList", async (queue, playlist) => {
      let data = await client.music.get(`${queue.textChannel.guildId}.music`);
      if (data) {
        await client.updatequeue(queue);
        if (data.channel === queue.textChannel.id) return;
      }

      queue.textChannel
        .send({
          embeds: [
            new EmbedBuilder()
              .setColor(client.config.embed.color)
              .setAuthor({
                name: `Playlist Adicionada a faixa`,
                iconURL: playlist.user.displayAvatarURL({ dynamic: true }),
                url: playlist.url,
              })
              .setThumbnail(playlist.thumbnail)
              .setDescription(`** [\`${playlist.name}\`](${playlist.url}) **`)
              .addFields([
                {
                  name: `Pedido por`,
                  value: `\`${playlist.user.tag}\``,
                  inline: true,
                },
                {
                  name: `Musicas`,
                  value: `\`${playlist.songs.length}\``,
                  inline: true,
                },
                {
                  name: `Dura????o`,
                  value: `\`${playlist.formattedDuration}\``,
                  inline: true,
                },
              ])
              .setFooter(client.getFooter(playlist.user)),
          ],
        })
        .then((msg) => {
          setTimeout(() => {
            msg.delete().catch((e) => null);
          }, 5000);
        });
    });

    client.distube.on("disconnect", async (queue) => {
      await client.autoresume.delete(queue.textChannel.guildId);
      await client.editPlayerMessage(queue.textChannel);
      await client.updateembed(client, queue.textChannel.guild);
      let db = await client.music?.get(`${queue.textChannel.guildId}.vc`);
      if (db && db?.enable) {
        await client.joinVoiceChannel(queue.textChannel.guild);
      }
      let data = await client.music.get(`${queue.textChannel.guildId}.music`);
      if (data) {
        if (data.channel === queue.textChannel.id) return;
      }
      queue.textChannel
        .send({
          embeds: [
            new EmbedBuilder()
              .setColor(client.config.embed.color)
              .setDescription(
                `${
                  client.config.emoji.ERROR
                } Desconctando do <#${voiceMap.get(
                  queue.textChannel.guildId
                )}> Canal de voz`
              ),
          ],
        })
        .then((msg) => {
          setTimeout(() => {
            msg.delete().catch((e) => null);
          }, 5000);
        });
    });

    client.distube.on("error", async (channel, error) => {
      channel
        .send({
          embeds: [
            new EmbedBuilder()
              .setColor(client.config.embed.color)
              .setTitle(`Found a Error...`)
              .setDescription(String(error).substring(0, 3000)),
          ],
        })
        .then((msg) => {
          setTimeout(() => {
            msg.delete().catch((e) => null);
          }, 5000);
        });
    });

    client.distube.on("noRelated", async (queue) => {
      queue.textChannel
        .send({
          embeds: [
            new EmbedBuilder()
              .setColor(client.config.embed.color)
              .setTitle(
                `Nenhuma m??sica relacionada encontrada para \`${queue?.songs[0].name}\``
              ),
          ],
        })
        .then((msg) => {
          setTimeout(() => {
            msg.delete().catch((e) => null);
          }, 5000);
        });
    });

    client.distube.on("finishSong", async (queue, song) => {
      await client.editPlayerMessage(queue.textChannel);
    });

    client.distube.on("finish", async (queue) => {
      await client.updateembed(client, queue.textChannel.guild);
      await client.editPlayerMessage(queue.textChannel);
      queue.textChannel
        .send({
          embeds: [
            new EmbedBuilder()
              .setColor(client.config.embed.color)
              .setDescription(`Terminei de tocar a faixa! sem mais musicas para tocar`),
          ],
        })
        .then((msg) => {
          setTimeout(() => {
            msg.delete().catch((e) => null);
          }, 5000);
        });
    });

    client.distube.on("initQueue", async (queue) => {
      voiceMap.set(queue.textChannel.guildId, queue.voiceChannel.id);
      queue.volume = client.config.options.defaultVolume;
      /**
       * Autoresume Code
       */
      setInterval(async () => {
        let newQueue = client.distube.getQueue(queue.textChannel.guildId);
        let autoresume = await client.music.get(
          `${queue.textChannel.guildId}.autoresume`
        );
        if (newQueue && autoresume) {
          const buildTrack = (track) => {
            return {
              memberId: track.member.id,
              source: track.source,
              duration: track.duration,
              formattedDuration: track.formattedDuration,
              id: track.id,
              isLive: track.isLive,
              name: track.name,
              thumbnail: track.thumbnail,
              type: "video",
              uploader: track.uploader,
              url: track.url,
              views: track.views,
            };
          };
          await client.autoresume.ensure(queue.textChannel.guildId, {
            guild: newQueue.textChannel.guildId,
            voiceChannel: newQueue.voiceChannel
              ? newQueue.voiceChannel.id
              : null,
            textChannel: newQueue.textChannel ? newQueue.textChannel.id : null,
            songs:
              newQueue.songs && newQueue.songs.length > 0
                ? [...newQueue.songs].map((track) => buildTrack(track))
                : null,
            volume: newQueue.volume,
            repeatMode: newQueue.repeatMode,
            playing: newQueue.playing,
            currentTime: newQueue.currentTime,
            autoplay: newQueue.autoplay,
          });
          let data = await client.autoresume.get(newQueue.textChannel.guildId);
          if (!data) return;
          if (data?.guild != newQueue.textChannel.guildId) {
            await client.autoresume.set(
              `${newQueue.textChannel.guildId}.guild`,
              newQueue.textChannel.guildId
            );
          }
          if (
            data?.voiceChannel != newQueue.voiceChannel
              ? newQueue.voiceChannel.id
              : null
          ) {
            await client.autoresume.set(
              `${newQueue.textChannel.guildId}.voiceChannel`,
              newQueue.voiceChannel ? newQueue.voiceChannel.id : null
            );
          }
          if (
            data?.textChannel != newQueue.textChannel
              ? newQueue.textChannel.id
              : null
          ) {
            await client.autoresume.set(
              `${newQueue.textChannel.guildId}.textChannel`,
              newQueue.textChannel ? newQueue.textChannel.id : null
            );
          }

          if (data?.volume != newQueue.volume) {
            await client.autoresume.set(
              `${newQueue.textChannel.guildId}.volume`,
              newQueue.volume
            );
          }
          if (data?.repeatMode != newQueue.repeatMode) {
            await client.autoresume.set(
              `${newQueue.textChannel.guildId}.repeatMode`,
              newQueue.repeatMode
            );
          }
          if (data?.playing != newQueue.playing) {
            await client.autoresume.set(
              `${newQueue.textChannel.guildId}.playing`,
              newQueue.playing
            );
          }
          if (data?.currentTime != newQueue.currentTime) {
            await client.autoresume.set(
              `${newQueue.textChannel.guildId}.currentTime`,
              newQueue.currentTime
            );
          }
          if (data?.autoplay != newQueue.autoplay) {
            await client.autoresume.set(
              `${newQueue.textChannel.guildId}.autoplay`,
              newQueue.autoplay
            );
          }
          if (
            newQueue?.songs &&
            !arraysEqual(data?.songs, [...newQueue.songs])
          ) {
            await client.autoresume.set(
              `${newQueue.textChannel.guildId}.songs`,
              [...newQueue.songs].map((track) => buildTrack(track))
            );
          }

          function arraysEqual(a, b) {
            if (a === b) return true;
            if (a == null || b == null) return false;
            if (a.length !== b.length) return false;

            for (var i = 0; i < a.length; ++i) {
              if (a[i] !== b[i]) return false;
            }
            return true;
          }
        }
      }, 10000);
    });

    client.distube.on("searchCancel", async (message, quary) => {
      message.channel
        .send({
          embeds: [
            new EmbedBuilder()
              .setColor(client.config.embed.color)
              .setDescription(`Gomen????, n??o consigo procurar por: \`${quary}\``),
          ],
        })
        .then((msg) => {
          setTimeout(() => {
            msg.delete().catch((e) => null);
          }, 5000);
        });
    });

    client.distube.on("searchNoResult", async (message, quary) => {
      message.channel
        .send({
          embeds: [
            new EmbedBuilder()
              .setColor(client.config.embed.color)
              .setDescription(
                `${client.config.emoji.ERROR} Gomen ????, nenhum resultado encontrado para: \`${quary}\`!`
              ),
          ],
        })
        .then((msg) => {
          setTimeout(() => {
            msg.delete().catch((e) => null);
          }, 5000);
        });
    });

    client.distube.on("empty", async (queue) => {
      await client.editPlayerMessage(queue.textChannel);
      let db = await client.music?.get(`${queue.textChannel.guildId}.vc`);
      if (db.enable) {
        await client.joinVoiceChannel(queue.textChannel.guild);
      } else {
        queue.stop().catch((e) => null);
        await client.updateembed(client, queue.textChannel.guild);
        queue.textChannel
          .send({
            embeds: [
              new EmbedBuilder()
                .setColor(client.config.embed.color)
                .setDescription("Bom...j?? que n??o tem ninguem. vou sair aqui!"),
            ],
          })
          .then((msg) => {
            setTimeout(() => {
              msg.delete().catch((e) => null);
            }, 5000);
          });
      }
    });
  } catch (e) {}

  // interaction handling
  try {
    client.on("interactionCreate", async (interaction) => {
      if (!interaction.guild || interaction.user.bot) return;
      if (interaction.isButton()) {
        await interaction.deferUpdate().catch((e) => {});
        const { customId, member } = interaction;
        let voiceMember = interaction.guild.members.cache.get(member.id);
        let channel = voiceMember.voice.channel;
        let queue = client.distube.getQueue(interaction.guildId);
        let checkDJ = await check_dj(
          client,
          interaction.member,
          queue?.songs[0]
        );

        switch (customId) {
          case "autoplay":
            {
              if (!channel) {
                return send(
                  interaction,
                  `** ${client.config.emoji.ERROR} Voc?? prescisa estar em um canal de voz**`
                );
              } else if (
                interaction.guild.members.me.voice.channel &&
                !interaction.guild.members.me.voice.channel.equals(channel)
              ) {
                return send(
                  interaction,
                  ` ${client.config.emoji.ERROR} Voc?? precisa entrar no canal __My__ Voice `
                );
              } else if (!queue) {
                return send(
                  interaction,
                  ` ${client.config.emoji.ERROR} Eu estou tocando agora `
                );
              } else if (checkDJ) {
                return send(
                  interaction,
                  `${client.config.emoji.SUCCESS} Voc?? n??o ?? o Deejay! e Voc?? n??o deve soclicitar musicas no momento ????`
                );
              } else if (!queue.autoplay) {
                queue.toggleAutoplay();
                return send(
                  interaction,
                  ` ${client.config.emoji.SUCCESS} Autoplay Ativado!! `
                );
              } else {
                queue.toggleAutoplay();
                return send(
                  interaction,
                  ` ${client.config.emoji.SUCCESS} Autoplay Desativado !!.`
                );
              }
            }
            break;
          case "skip":
            {
              if (!channel) {
                return send(
                  interaction,
                  ` ${client.config.emoji.ERROR} Voc?? prescisa estar em um canal de voz`
                );
              } else if (
                interaction.guild.members.me.voice.channel &&
                !interaction.guild.members.me.voice.channel.equals(channel)
              ) {
                return send(
                  interaction,
                  ` ${client.config.emoji.ERROR} Voc?? precisa entrar no canal __My__ Voice`
                );
              } else if (!queue) {
                return send(
                  interaction,
                  ` ${client.config.emoji.ERROR} No momento n??o estou tocando nada! `
                );
              } else if (checkDJ) {
                return send(
                  interaction,
                  `${client.config.emoji.SUCCESS} Voc?? n??o ?? o Deejay! e Voc?? n??o deve soclicitar musicas no momento ????`
                );
              } else {
                await skip(queue);
                return send(
                  interaction,
                  `${client.config.emoji.SUCCESS}  A musica pulada !!`
                );
              }
            }
            break;
          case "stop":
            {
              if (!channel) {
                return send(
                  interaction,
                  ` ${client.config.emoji.ERROR} Voc?? prescisa estar em um canal de voz`
                );
              } else if (
                interaction.guild.members.me.voice.channel &&
                !interaction.guild.members.me.voice.channel.equals(channel)
              ) {
                return send(
                  interaction,
                  ` ${client.config.emoji.ERROR} Voc?? precisa entrar no canal __My__ Voice `
                );
              } else if (!queue) {
                return send(
                  interaction,
                  ` ${client.config.emoji.ERROR} No momento n??o estou tocando nada!`
                );
              } else if (checkDJ) {
                return send(
                  interaction,
                  `${client.config.emoji.SUCCESS} Voc?? n??o ?? o Deejay! e Voc?? n??o deve soclicitar musicas no momento ????`
                );
              } else {
                await queue.stop().catch((e) => {});
                return send(
                  interaction,
                  ` ${client.config.emoji.SUCCESS} A musica foi parada, vou sair aqui qualquer coisa me chama de novo ??? !!.`
                );
              }
            }
            break;
          case "pauseresume":
            {
              if (!channel) {
                return send(
                  interaction,
                  ` ${client.config.emoji.ERROR} Voc?? prescisa estar em um canal de voz`
                );
              } else if (
                interaction.guild.members.me.voice.channel &&
                !interaction.guild.members.me.voice.channel.equals(channel)
              ) {
                return send(
                  interaction,
                  ` ${client.config.emoji.ERROR} Voc?? precisa entrar no canal __My__ Voice `
                );
              } else if (!queue) {
                return send(
                  interaction,
                  ` ${client.config.emoji.ERROR} No momento n??o estou tocando nada! `
                );
              } else if (checkDJ) {
                return send(
                  interaction,
                  `${client.config.emoji.SUCCESS} Voc?? n??o ?? o Deejay! e Voc?? n??o deve soclicitar musicas no momento ????`
                );
              } else if (queue.paused) {
                await queue.resume();
                return send(
                  interaction,
                  ` ${client.config.emoji.SUCCESS} A faixa foi retomada!! `
                );
              } else if (!queue.paused) {
                await queue.pause();
                return send(
                  interaction,
                  ` ${client.config.emoji.SUCCESS} A faixa est?? pausada!! `
                );
              }
            }
            break;
          case "loop":
            {
              if (!channel) {
                return send(
                  interaction,
                  `${client.config.emoji.ERROR} Voc?? prescisa estar em um canal de voz`
                );
              } else if (
                interaction.guild.members.me.voice.channel &&
                !interaction.guild.members.me.voice.channel.equals(channel)
              ) {
                return send(
                  interaction,
                  `${client.config.emoji.ERROR} Voc?? precisa entrar no canal __My__ Voice`
                );
              } else if (!queue) {
                return send(
                  interaction,
                  `${client.config.emoji.ERROR} No momento n??o estou tocando nada!`
                );
              } else if (checkDJ) {
                return send(
                  interaction,
                  `${client.config.emoji.SUCCESS} Voc?? n??o ?? o Deejay! e Voc?? n??o deve soclicitar musicas no momento ????`
                );
              } else if (queue.repeatMode === 0) {
                await queue.setRepeatMode(1);
                return send(
                  interaction,
                  `${client.config.emoji.SUCCESS} Repetir musica ativado !!`
                );
              } else if (queue.repeatMode === 1) {
                await queue.setRepeatMode(2);
                return send(
                  interaction,
                  `${client.config.emoji.SUCCESS} repetir faixa ativado !!`
                );
              } else if (queue.repeatMode === 2) {
                await queue.setRepeatMode(0);
                return send(
                  interaction,
                  ` ${client.config.emoji.SUCCESS} modo de repeti????o desativado !!`
                );
              }
            }
            break;
          default:
            break;
        }
      }
    });
  } catch (e) {
    console.log(e);
  }

  // request channel
  try {
    client.on("messageCreate", async (message) => {
      if (!message.guild || !message.id) return;
      let data = await client.music.get(`${message.guild.id}.music`);
      if (!data) return;
      let musicchannel = message.guild.channels.cache.get(data.channel);
      if (!musicchannel) return;
      if (message.channelId === musicchannel.id) {
        // code
        if (message.author.bot) {
          if (message.id != data.qmsg || message.id != data.pmsg) {
            setTimeout(() => {
              message.delete().catch((e) => {});
            }, 3000);
          }
        } else {
          let song = message.cleanContent;
          if (message.id != data.qmsg || message.id != data.pmsg) {
            setTimeout(() => {
              message.delete().catch((e) => {});
            }, 1000);
          }
          let voiceChannel = message.member.voice.channel;

          if (
            !message.guild.members.me.permissions.has(
              PermissionFlagsBits.Connect
            )
          ) {
            return client.embed(
              message,
              `** ${client.config.emoji.ERROR} Eu n??o tenho permiss??o para entrar no canal de voz **`
            );
          } else if (!voiceChannel) {
            return client.embed(
              message,
              `** ${client.config.emoji.ERROR} Voc?? prescisa estar em um canal de voz **`
            );
          } else if (
            message.guild.members.me.voice.channel &&
            !message.guild.members.me.voice.channel.equals(voiceChannel)
          ) {
            return client.embed(
              message,
              `** ${client.config.emoji.ERROR} Voc?? precisa entrar no canal __My__ Voice**`
            );
          } else {
            client.distube.play(voiceChannel, song, {
              member: message.member,
              message: message,
              textChannel: message.channel,
            });
          }
        }
      }
    });
  } catch (e) {}

  /**
   *
   * @param {ButtonInteraction} interaction
   * @param {*} string
   * @returns
   */
  async function send(interaction, string) {
    interaction
      .followUp({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.embed.color)
            .setDescription(`> ${string.substring(0, 3000)}`)
            .setFooter(client.getFooter(interaction.user)),
        ],
        ephemeral: true,
      })
      // .then((msg) => {
      //   setTimeout(() => {
      //     msg.delete().catch((e) => null);
      //   }, 1000);
      // })
      .catch((e) => null);
  }
};
