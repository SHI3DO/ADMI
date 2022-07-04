import { ICommand } from "wokcommands";

export default {
  category: "Info",
  description: "Displays the latency",
  slash: true,

  callback: ({ interaction, client }) => {
    interaction.reply({
      content: `REST Latency: ${Math.abs(
        interaction.createdTimestamp - Date.now()
      )}ms | API Latency: ${Math.round(client.ws.ping)}ms`,
    });
  },
} as ICommand;
