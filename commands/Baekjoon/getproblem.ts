import { ApplicationCommandOptionTypes } from "discord.js/typings/enums";
import { ICommand } from "wokcommands";
import { parse } from "node-html-parser";
import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";

function resembed(
  title: string,
  problem_desc: string,
  problem_ul: string,
  problem_input_description: string,
  prorblem_output_description: string
) {
  return new MessageEmbed()
    .setFooter({
      text: "실제 문제에 더 많은 정보가 있을 수 있습니다. 아래 링크버튼을 눌러주세요.",
    })
    .setColor("#FA747D")
    .setTitle(title)
    .addFields([
      {
        name: "Problem",
        value: `${problem_desc}`,
        inline: false,
      },
      {
        name: "Problem_ul",
        value: `${problem_ul}`,
        inline: false,
      },
      {
        name: "Input Description",
        value: `${problem_input_description}`,
        inline: false,
      },
      {
        name: "Output Description",
        value: `${prorblem_output_description}`,
        inline: false,
      },
    ]);
}

function parsehtml(content: string) {
  if (content) {
    return content
      .replace(/<\/?[^>]+(>|$)/g, "")
      .replace(/\&nbsp;/g, "")
      .replace(/\&lt;/g, "<")
      .replace(/\&hellip;/g, "…")
      .replace(/\&le;/g, "≤")
      .replace(/\&ge;/g, "≥")
      .replace(/\&#39;/g, "'")
      .replace(/\&quot;/g, '"')
      .replace(/\&gt;/g, ">");
  }
}

export default {
  category: "Baekjoon",
  description: "Get Baekjoon Problem contents",
  slash: true,
  options: [
    {
      name: "p_number",
      description: "Problem number",
      required: true,
      type: ApplicationCommandOptionTypes.INTEGER,
    },
  ],

  callback: ({ interaction }) => {
    const problem_number = interaction.options.getInteger("p_number");
    fetch("https://www.acmicpc.net/problem/" + problem_number)
      .then(function (response) {
        if (response.status != 200) {
          interaction.reply({
            content: `Looks like there was a problem. Status Code: ${response.status}`,
          });
          return;
        }
        response.text().then(function (data) {
          const problemvar = parse(data);
          const problem_ul = parsehtml(
            problemvar.querySelector("#problem_description > ul")?.toString()!
          );
          const problem_description = parsehtml(
            problemvar.querySelector("#problem_description > p")?.toString()!
          );
          const problem_input_description = parsehtml(
            problemvar.querySelector("#problem_input > p")?.toString()!
          );
          const prorblem_output_description = parsehtml(
            problemvar.querySelector("#problem_output > p")?.toString()!
          );
          //const sample_i = parsehtml(problemvar.querySelector('pre[id^=sample-input]')?.toString()!)
          //const sample_o = parsehtml(problemvar.querySelector('pre[id^=sample-output]')?.toString()!)

          const embed = resembed(
            `Baekjoon ${problem_number}`,
            problem_description!,
            problem_ul!,
            problem_input_description!,
            prorblem_output_description!
          );

          const row = new MessageActionRow().addComponents(
            new MessageButton()
              .setLabel("Problem URL")
              .setURL("https://www.acmicpc.net/problem/" + problem_number)
              .setStyle("LINK")
          );
          interaction.reply({
            embeds: [embed],
            components: [row],
          });
        });
      })
      .catch(function (err) {
        interaction.reply({
          content: `Fetch Error: ${err}`,
        });
      });
  },
} as ICommand;
