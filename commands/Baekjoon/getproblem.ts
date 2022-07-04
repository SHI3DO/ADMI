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
                    label: "C",
                    value: "C"
                },
                {
                  label: "Node.js",
                  value: "Node.js",
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
            let language = ""
            let file_extension = ""
            let lan_url = ""
            if (value === "Python") {
                language = "Python"
                file_extension = "py"
                lan_url = "Python"
            } else if (value === "C++") {
                language = "C++"
                file_extension = "cpp"
                lan_url = "C++"
            } else if (value === "Java") {
                language = "Java"
                file_extension = "java"
                lan_url = "Java"
            } else if (value === "Ruby") {
                language = "Ruby"
                file_extension = "rb"
                lan_url = "Ruby"
            } else if (value === "Kotlin") {
                language = "Kotlin"
                file_extension = "kt"
                lan_url = "Kotlin"
            } else if (value === "Swift") {
                language = "Swift"
                file_extension = "swift"
                lan_url = "Swift"
            } else if (value === "Text") {
                language = "Text"
                file_extension = "txt"
                lan_url = "Text"
            } else if (value === "C#") {
                language = "C#"
                file_extension = "cs"
                lan_url = "C%23"
            } else if (value === "Go") {
                language = "Go"
                file_extension = "go"
                lan_url = "Go"
            } else if (value === "Node.js") {
                language = "Node.js"
                file_extension = "js"
                lan_url = "Nodejs"
            } else if (value === "D") {
                language = "D"
                file_extension = "d"
                lan_url = "D"
            } else if (value === "C") {
                language = "C"
                file_extension = "c"
                lan_url = "C"
            }
            console.log(language, file_extension, lan_url)
            fetch(`https://raw.githubusercontent.com/SHI3DO/ADMI/main/Baekjoon_codeset/${lan_url}/${problem_number}.${file_extension}`)
            .then(async function (response_2) {
                if (response_2.status != 200) {
                    await i.update({
                      content:
                        problem_number +
                        "번의 "+language + " 예시는 아직 존재하지 않습니다.",
                      embeds: [],
                      components: [buttonrow],
                    });
                    collector.stop();
                    return;
                  }
                  response_2.text().then(async function (data_2) {
                    const embed_2 = ansembed(
                      `Baekjoon ${problem_number}`,
                      "```" + file_extension + "\n" + data_2 + "```",
                      language
                    );
                    await i.update({
                      embeds: [embed, embed_2],
                      components: [buttonrow],
                    });
                    collector.stop();
                  });
            })
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
function async(async: any, arg1: any, arg2: {}) {
    throw new Error("Function not implemented.");
}

