import { INextModuleResolver, Module} from "@/base";
import { TModuleConstructor, TNullable } from "@/base";
import { EStartMenuOption } from "@/modules/root-module.types";

import { AddExpenseModule } from '@/modules/add-expense-module/AddExpenseModule';
import { SummaryModule } from "@/modules/summary-module/SummaryModule";
import { RecordsModule } from "@/modules/records-module/RecordsModule";

import { QuestionCollection } from "inquirer";
import chalk from "chalk";

export class RootModule extends Module implements INextModuleResolver {
  name = 'RootModule'
  children: TModuleConstructor[] = [AddExpenseModule, SummaryModule, RecordsModule];
  parent = null
  questions: QuestionCollection = [
    {
      message: 'What can I do for you?\n',
      name: 'action',
      type: 'list',
      default: EStartMenuOption.SHOW_ALL_RECORDS - 1,
      pageSize: Infinity,
      choices: [
        { name: 'Show all records', value: EStartMenuOption.SHOW_ALL_RECORDS },
        { name: 'Add expense record', value: EStartMenuOption.ADD_RECORD },
        { name: 'Show summary', value: EStartMenuOption.SHOW_SUMMARY },
        { name: chalk.redBright('Close'), value: EStartMenuOption.CLOSE },
      ],
    },
  ];

  nextModuleResolver(): TNullable<TModuleConstructor> {
    if (this.answers?.action === EStartMenuOption.ADD_RECORD) return AddExpenseModule;
    if (this.answers?.action === EStartMenuOption.SHOW_SUMMARY) return SummaryModule;
    if (this.answers?.action === EStartMenuOption.SHOW_ALL_RECORDS) return RecordsModule;
    if (this.answers?.action === EStartMenuOption.CLOSE) this.suspend();
    return null;
  }
}
