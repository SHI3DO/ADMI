import { ApplicationCommandOptionTypes } from 'discord.js/typings/enums';
import { ICommand } from 'wokcommands';

export default {
   category: 'Math',
   description: 'A-B',
   slash: true,
   options: [
    {
        name: 'a',
        description: 'number 1',
        required: true,
        type: ApplicationCommandOptionTypes.NUMBER,
    },
    {
        name: 'b',
        description: 'number 2',
        required: true,
        type: ApplicationCommandOptionTypes.NUMBER,
    },
   ],

   callback: ({ interaction }) => {
      interaction.reply({
         content: `${interaction.options.getNumber('a')!} - ${interaction.options.getNumber('b')!} = ${interaction.options.getNumber('a')! - interaction.options.getNumber('b')!}`
      });
   },
} as ICommand;