const { ActivityType } = require("discord.js");
const client = require("../index");

client.on("ready", async () => {
  console.log(`${client.user.username} Está on`);
  client.user.setActivity({
    name: `Rival Schools`,
    type: ActivityType.playing,
  });

  // loading database
  await require("../handlers/Database")(client);

  // loading dashboard
  require("../server");

  client.guilds.cache.forEach(async (guild) => {
    await client.updateembed(client, guild);
  });
});
