import { Message } from "discord.js";
import { ICommand } from "wokcommands";
import baekjoondb from "../../db/baekjoondb";

export default {
  category: "Baekjoon",
  description: "백준 로그인 in Discord",
  slash: true,

  callback: async ({ interaction }) => {
    await interaction.reply({
      content: "추가 작업을 위한 dm을 보내드렸습니다.",
    });
    const filter = (m: Message) => m.author.id === interaction.user.id;
    const dmchannel = await interaction.user.createDM();
    const collector = dmchannel.createMessageCollector({
      filter,
      time: 1000 * 10,
      max: 1,
    });
    if (await baekjoondb.findOne({ UserID: `${interaction.user.id}` })) {
      await interaction.user.send(
        "이미 등록된 계정입니다. 수정하시겠습니까? (ㅇ/ㄴ)"
      );
      collector.on("collect", async (message) => {
        collector.stop();
        if (message.content === "ㅇ") {
          var userinfo = await baekjoondb.findOne({
            UserID: `${interaction.user.id}`,
          });
          await interaction.user
            .send(
              `현재 \nID: ${userinfo?.bojusername}\nPW: ${userinfo?.bojpassword}\n이 메시지는 5초 뒤 삭제됩니다.`
            )
            .then((mmm) => {
              setTimeout(() => mmm.delete(), 5000);
            });
          await interaction.user.send(
            "새 아이디를 입력해주세요. (10초) (보내신 메시지는 작업이 끝난 후 보안을 위해 삭제해주세요.)"
          );
          const collector_2 = dmchannel.createMessageCollector({
            filter,
            time: 1000 * 10,
            max: 1,
          });
          collector_2.on("collect", async (message_2) => {
            collector_2.stop();
            const reg_userid = message_2.content;
            const collector_3 = dmchannel.createMessageCollector({
              filter,
              time: 1000 * 10,
              max: 1,
            });
            await interaction.user.send(
              "새 비밀번호를 입력해주세요. (10초) (보내신 메시지는 작업이 끝난 후 보안을 위해 삭제해주세요.)"
            );
            collector_3.on("collect", async (message_3) => {
              collector_3.stop();
              const reg_password = message_3.content;

              setTimeout(async () => {
                await baekjoondb.updateOne(
                  { UserID: `${interaction.user.id}` },
                  {
                    bojusername: reg_userid,
                    bojpassword: reg_password,
                  }
                );
              }, 1000);

              interaction.user.send("수정이 완료되었습니다.");
            });
            collector_3.on("end", async (collected) => {
              if (collected.size === 0) {
                await interaction.user.send("시간이 초과되었습니다.");
              }
            });
          });
          collector_2.on("end", async (collected) => {
            if (collected.size === 0) {
              await interaction.user.send("시간이 초과되었습니다.");
            }
          });
        } else {
          collector.stop();
          interaction.user.send("네.");
        }
      });
      collector.on("end", async (collected) => {
        if (collected.size === 0) {
          await interaction.user.send("시간이 초과되었습니다.");
        }
      });
    } else {
      await interaction.user.send(
        "등록되지 않은 계정입니다. 아이디를 입력해주세요. (10초) (보내신 메시지는 작업이 끝난 후 보안을 위해 삭제해주세요.)"
      );
      collector.on("collect", async (message) => {
        collector.stop();
        await interaction.user.send(
          "비밀번호를 입력해주세요. (10초) (보내신 메시지는 작업이 끝난 후 보안을 위해 삭제해주세요.)"
        );
        const reg_userid = message.content;
        const collector_2 = dmchannel.createMessageCollector({
          filter,
          time: 1000 * 10,
          max: 1,
        });
        collector_2.on("collect", async (message_2) => {
          collector_2.stop();
          const reg_password = message_2.content;

          setTimeout(async () => {
            await new baekjoondb({
              UserID: `${interaction.user.id}`,
              bojusername: reg_userid,
              bojpassword: reg_password,
            }).save();
          }, 1000);

          interaction.user.send("등록이 완료되었습니다.");
        });
        collector_2.on("end", async (collected) => {
          if (collected.size === 0) {
            await interaction.user.send("시간이 초과되었습니다.");
          }
        });
      });
      collector.on("end", async (collected) => {
        if (collected.size === 0) {
          await interaction.user.send("시간이 초과되었습니다.");
        }
      });
    }
  },
} as ICommand;
