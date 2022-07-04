import { ApplicationCommandOptionTypes } from "discord.js/typings/enums";
import { ICommand } from "wokcommands";
import { parse } from "node-html-parser";
import {
  MessageActionRow,
  MessageButton,
  MessageComponentInteraction,
  MessageEmbed,
  MessageSelectMenu,
} from "discord.js";

function resembed(
  title: string,
  problem_desc: string,
  problem_ul: string,
  problem_input_description: string,
  prorblem_output_description: string
) {
  return new MessageEmbed()
    .setFooter({
      text: "실제 문제에 더 많은 정보가 있을 수 있습니다. 아래 링크버튼을 눌러주세요.\n각 언어 별 정답 보기는 15초 후 사라집니다.",
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

function ansembed(title: string, contents: string, language: string) {
  return new MessageEmbed()
    .setFooter({
      text: "아래 버튼을 통해 더 많은 문제에 기여해주세요.",
    })
    .setColor("#FA747D")
    .setTitle(title)
    .addFields([
      {
        name: language,
        value: contents,
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

  callback: async ({ interaction, channel }) => {
    const problem_number = interaction.options.getInteger("p_number");
    fetch("https://www.acmicpc.net/problem/" + problem_number)
      .then(async function (response) {
        if (response.status != 200) {
          await interaction.reply({
            content: `Looks like there was a problem. Status Code: ${response.status}`,
          });
          return;
        }
        response.text().then(async function (data) {
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
            new MessageSelectMenu()
              .setCustomId("row")
              .setPlaceholder("Answer")
              .addOptions([
                {
                  label: "Python",
                  value: "Python",
                },
                {
                  label: "C++",
                  value: "C++",
                },
                {
                  label: "Java",
                  value: "Java",
                },
                {
                  label: "Ruby",
                  value: "Ruby",
                },
                {
                  label: "Kotlin",
                  value: "Kotlin",
                },
                {
                  label: "Swift",
                  value: "Swift",
                },
                {
                  label: "Text",
                  value: "Text",
                },
                {
                  label: "C#",
                  value: "C#",
                },
                {
                  label: "node.js",
                  value: "node.js",
                },
                {
                  label: "Go",
                  value: "Go",
                },
                {
                  label: "D",
                  value: "D",
                },
              ])
          );

          const buttonrow = new MessageActionRow()
            .addComponents(
              new MessageButton()
                .setLabel("Problem URL")
                .setURL("https://www.acmicpc.net/problem/" + problem_number)
                .setStyle("LINK")
            )
            .addComponents(
              new MessageButton()
                .setLabel("Contribute")
                .setURL(
                  "https://github.com/SHI3DO/ADMI/tree/main/Baekjoon_codeset"
                )
                .setStyle("LINK")
            );

          await interaction.reply({
            embeds: [embed],
            components: [row, buttonrow],
          });

          const filter = (DropDown: MessageComponentInteraction) => {
            return interaction.user.id === DropDown.user.id;
          };

          const collector = channel.createMessageComponentCollector({
            filter,
            max: 1,
            time: 1000 * 15,
            componentType: "SELECT_MENU",
          });

          collector.on("collect", async (i) => {
            const value = i.values[0];
            if (value === "Python") {
              fetch(
                "https://raw.githubusercontent.com/SHI3DO/ADMI/main/Baekjoon_codeset/Python/" +
                  problem_number +
                  ".py"
              ).then(async function (response_2) {
                if (response_2.status != 200) {
                  await i.update({
                    content:
                      problem_number + "번의 Python 예시는 아직 존재하지 않습니다.",
                    embeds: [],
                    components: [buttonrow],
                  });
                  collector.stop();
                  return;
                }
                response_2.text().then(async function (data_2) {
                  const embed_2 = ansembed(
                    `Baekjoon ${problem_number}`,
                    "```python\n" + data_2 + "```",
                    "Python"
                  );
                  await i.update({
                    embeds: [embed, embed_2],
                    components: [buttonrow],
                  });
                  collector.stop();
                });
              });
            } else if (value === "C++") {
              fetch(
                "https://raw.githubusercontent.com/SHI3DO/ADMI/main/Baekjoon_codeset/C++/" +
                  problem_number +
                  ".cpp"
              ).then(async function (response_2) {
                if (response_2.status != 200) {
                  await i.update({
                    content:
                      problem_number + "번의 C++ 예시는 아직 존재하지 않습니다.",
                    embeds: [],
                    components: [buttonrow],
                  });
                  collector.stop();
                  return;
                }
                response_2.text().then(async function (data_2) {
                  const embed_2 = ansembed(
                    `Baekjoon ${problem_number}`,
                    "```C++\n" + data_2 + "```",
                    "C++"
                  );
                  await i.update({
                    embeds: [embed, embed_2],
                    components: [buttonrow],
                  });
                  collector.stop();
                });
              });
            } else if (value === "Java") {
                fetch(
                  "https://raw.githubusercontent.com/SHI3DO/ADMI/main/Baekjoon_codeset/Java/" +
                    problem_number +
                    ".java"
                ).then(async function (response_2) {
                  if (response_2.status != 200) {
                    await i.update({
                      content:
                        problem_number + "번의 Java 예시는 아직 존재하지 않습니다.",
                      embeds: [],
                      components: [buttonrow],
                    });
                    collector.stop();
                    return;
                  }
                  response_2.text().then(async function (data_2) {
                    const embed_2 = ansembed(
                      `Baekjoon ${problem_number}`,
                      "```Java\n" + data_2 + "```",
                      "Java"
                    );
                    await i.update({
                      embeds: [embed, embed_2],
                      components: [buttonrow],
                    });
                    collector.stop();
                  });
                });
              } else if (value === "Ruby") {
                fetch(
                  "https://raw.githubusercontent.com/SHI3DO/ADMI/main/Baekjoon_codeset/Ruby/" +
                    problem_number +
                    ".rb"
                ).then(async function (response_2) {
                  if (response_2.status != 200) {
                    await i.update({
                      content:
                        problem_number + "번의 Ruby 예시는 아직 존재하지 않습니다.",
                      embeds: [],
                      components: [buttonrow],
                    });
                    collector.stop();
                    return;
                  }
                  response_2.text().then(async function (data_2) {
                    const embed_2 = ansembed(
                      `Baekjoon ${problem_number}`,
                      "```Ruby\n" + data_2 + "```",
                      "Ruby"
                    );
                    await i.update({
                      embeds: [embed, embed_2],
                      components: [buttonrow],
                    });
                    collector.stop();
                  });
                });
              } else if (value === "Kotlin") {
                fetch(
                  "https://raw.githubusercontent.com/SHI3DO/ADMI/main/Baekjoon_codeset/Kotlin/" +
                    problem_number +
                    ".kt"
                ).then(async function (response_2) {
                  if (response_2.status != 200) {
                    await i.update({
                      content:
                        problem_number + "번의 Kotlin 예시는 아직 존재하지 않습니다.",
                      embeds: [],
                      components: [buttonrow],
                    });
                    collector.stop();
                    return;
                  }
                  response_2.text().then(async function (data_2) {
                    const embed_2 = ansembed(
                      `Baekjoon ${problem_number}`,
                      "```Kotlin\n" + data_2 + "```",
                      "Kotlin"
                    );
                    await i.update({
                      embeds: [embed, embed_2],
                      components: [buttonrow],
                    });
                    collector.stop();
                  });
                });
              }
          });
          collector.on("end", async () => {
            await interaction.editReply({
              embeds: [embed],
              components: [buttonrow],
            });
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
