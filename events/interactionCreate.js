const client = require("../index");
const {
  cooldown,
  check_dj,
  databasing,
  toPascalCase,
} = require("../handlers/functions");
const { emoji } = require("../settings/config");
const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  InteractionType,
} = require("discord.js");

client.on("interactionCreate", async (interaction) => {
  // Slash Command Handling
  if (interaction.isCommand()) {
    await interaction.deferReply({ ephemeral: false }).catch((e) => {});
    await databasing(interaction.guildId, interaction.user.id);
    const cmd = client.commands.get(interaction.commandName);
    if (!cmd)
      return client.embed(
        interaction,
        `${emoji.ERROR} \`${interaction.commandName}\` Comando não encontrado `
      );
    const args = [];
    for (let option of interaction.options.data) {
      if (option.type === ApplicationCommandOptionType.Subcommand) {
        if (option.name) args.push(option.name);
        option.options?.forEach((x) => {
          if (x.value) args.push(x.value);
        });
      } else if (option.value) args.push(option.value);
    }
    interaction.member = interaction.guild.members.cache.get(
      interaction.user.id
    );

    if (cmd) {
      // checking user perms
      let queue = client.distube.getQueue(interaction.guild.id);
      let voiceChannel = interaction.member.voice.channel;
      let botChannel = interaction.guild.members.me.voice.channel;
      let checkDJ = await check_dj(client, interaction.member, queue?.songs[0]);
      if (
        !interaction.member.permissions.has(
          PermissionFlagsBits[toPascalCase(cmd.userPermissions[0])] || []
        )
      ) {
        return client.embed(
          interaction,
          `Você não tem \`${cmd.userPermissions}\` permissão para usar esse \`${cmd.name}\` Comando!!`
        );
      } else if (
        !interaction.guild.members.me.permissions.has(
          PermissionFlagsBits[toPascalCase(cmd.botPermissions[0])] || []
        )
      ) {
        return client.embed(
          interaction,
          `Eu não tenho \`${cmd.botPermissions}\` Para usar esse \`${cmd.name}\` Comando!!`
        );
      } else if (cooldown(interaction, cmd)) {
        return client.embed(
          interaction,
          ` Calma ai , espere por:\`${cooldown(
            interaction,
            cmd
          ).toFixed()}\` Segundos`
        );
      } else if (cmd.inVoiceChannel && !voiceChannel) {
        return client.embed(
          interaction,
          `${emoji.ERROR} Você prescisa estar em um canal de voz primeiro!!`
        );
      } else if (
        cmd.inSameVoiceChannel &&
        botChannel &&
        !botChannel?.equals(voiceChannel)
      ) {
        return client.embed(
          interaction,
          `${emoji.ERROR} Você prescisa estar em um ${botChannel} canal de voz`
        );
      } else if (cmd.Player && !queue) {
        return client.embed(interaction, `${emoji.ERROR} A musica não está tocando!!`);
      } else if (cmd.djOnly && checkDJ) {
        return client.embed(
          interaction,
          `${emoji.ERROR} Você não é o Deejay! e Você não deve soclicitar musicas no momento 🤨`
        );
      } else {
        cmd.run(client, interaction, args, queue);
      }
    }
  }

  // Context Menu Handling
  if (interaction.isContextMenuCommand()) {
    await interaction.deferReply({ ephemeral: true }).catch((e) => {});
    const command = client.commands.get(interaction.commandName);
    if (command) command.run(client, interaction);
  }
});
