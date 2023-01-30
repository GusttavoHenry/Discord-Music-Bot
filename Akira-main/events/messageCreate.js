const {
  cooldown,
  check_dj,
  databasing,
  toPascalCase,
} = require("../handlers/functions");
const client = require("..");
const { PREFIX: botPrefix, emoji } = require("../settings/config");
const { PermissionFlagsBits } = require("discord.js");

client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.guild || !message.id) return;
  await databasing(message.guildId, message.author.id);
  let settings = await client.music.get(message.guild.id);
  let prefix = settings?.prefix || botPrefix;
  let mentionprefix = new RegExp(
    `^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`
  );
  if (!mentionprefix.test(message.content)) return;
  const [, nprefix] = message.content.match(mentionprefix);
  const args = message.content.slice(nprefix.length).trim().split(/ +/);
  const cmd = args.shift().toLowerCase();
  if (cmd.length === 0) {
    if (nprefix.includes(client.user.id)) {
      client.embed(
        message,
        ` ${emoji.SUCCESS} Para ver meus coamndos digite:  \`/help\` ou \`${prefix}help\``
      );
    }
  }
  const command =
    client.mcommands.get(cmd) ||
    client.mcommands.find((cmds) => cmds.aliases && cmds.aliases.includes(cmd));
  if (!command) return;
  if (command) {
    let queue = client.distube.getQueue(message.guild.id);
    let voiceChannel = message.member.voice.channel;
    let botChannel = message.guild.members.me.voice.channel;
    let checkDJ = await check_dj(client, message.member, queue?.songs[0]);

    if (
      !message.member.permissions.has(
        PermissionFlagsBits[toPascalCase(command.userPermissions[0])] || []
      )
    ) {
      return client.embed(
        message,
        `Você não tem \`${command.userPermissions}\` Permissão para usar esse \`${command.name}\` Comando!!`
      );
    } else if (
      !message.guild.members.me.permissions.has(
        PermissionFlagsBits[toPascalCase(command.botPermissions[0])] || []
      )
    ) {
      return client.embed(
        message,
        `Eu não tenho  \`${command.botPermissions}\` Permissão para usar esse \`${command.name}\` Comando!!`
      );
    } else if (cooldown(message, command)) {
      return client.embed(
        message,
        ` Calma ai , espere por: \`${cooldown(
          message,
          command
        ).toFixed()}\` Seconds`
      );
    } else if (command.inVoiceChannel && !voiceChannel) {
      return client.embed(
        message,
        `${emoji.ERROR} Você prescisa estar em um canal de voz primeiro!!`
      );
    } else if (
      command.inSameVoiceChannel &&
      botChannel &&
      !botChannel?.equals(voiceChannel)
    ) {
      return client.embed(
        message,
        `${emoji.ERROR} Você prescisa estar em um  ${botChannel} canal de voz!`
      );
    } else if (command.Player && !queue) {
      return client.embed(message, `${emoji.ERROR} Amusica não esta tocando`);
    } else if (command.djOnly && checkDJ) {
      return client.embed(
        message,
        `${emoji.ERROR} Você não é o Deejay! e Você não deve soclicitar musicas no momento 🤨`
      );
    } else {
      command.run(client, message, args, nprefix, queue);
    }
  }
});

function escapeRegex(newprefix) {
  return newprefix.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
}
