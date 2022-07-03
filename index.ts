import DiscordJS, { Intents } from "discord.js";
import WOKCommands from "wokcommands";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const client = new DiscordJS.Client({
  intents: new Intents(32767),
});

client.on("ready", async () => {
  new WOKCommands(client, {
    commandsDir: path.join(__dirname, "commands"),
    typeScript: true,
    testServers: ["760052266756603934"],
    botOwners: ["643116087919116298"],
    mongoUri: process.env.MONGO_URI,
  });

  console.log("Hello.");
});

client.login(process.env.TOKEN);
