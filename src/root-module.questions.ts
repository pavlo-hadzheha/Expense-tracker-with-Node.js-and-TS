import { IAnswer } from './types.js';

export enum EStartMenuOption {
  SHOW_ALL_RECORDS = 1,
  CLOSE = 2,
  ADD_RECORD = 3,
  SHOW_SUMMARY = 4,
}

export const rootModuleQuestions: IAnswer[] = [
  {
    message: 'What can I do for you?',
    name: 'action',
    type: 'list',
    default: EStartMenuOption.SHOW_ALL_RECORDS,
    choices: [
      { name: 'Show all records', value: EStartMenuOption.SHOW_ALL_RECORDS },
      { name: 'Add expense record', value: EStartMenuOption.ADD_RECORD },
      { name: 'Show summary', value: EStartMenuOption.SHOW_SUMMARY },
      { name: 'Close', value: EStartMenuOption.CLOSE },
    ],
  },
];
