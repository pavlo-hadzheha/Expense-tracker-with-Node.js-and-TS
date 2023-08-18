import { AddExpenseModule } from './add-expense-module/AddExpenseModule';

import {INextModuleResolver, Module} from "../base";
import { IModuleConstructor, TNullable } from "../base";
import { EStartMenuOption } from "./root-module.types";
import { SummaryModule } from "./summary-module/SummaryModule";

export class RootModule extends Module implements INextModuleResolver {
  children: IModuleConstructor[] = [AddExpenseModule];
  questions = [
    {
      message: 'What can I do for you?\n',
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

  nextModuleResolver(): TNullable<IModuleConstructor> {
    if (this.answers.action === EStartMenuOption.ADD_RECORD) return AddExpenseModule;
    if (this.answers.action === EStartMenuOption.SHOW_SUMMARY) return SummaryModule;
    if (this.answers.action === EStartMenuOption.SHOW_ALL_RECORDS) this.suspend();
    if (this.answers.action === EStartMenuOption.CLOSE) this.suspend();
    return null;
  }
}
