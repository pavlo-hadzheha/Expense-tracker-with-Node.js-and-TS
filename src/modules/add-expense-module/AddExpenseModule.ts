import chalk from "chalk";

import { db } from '@/db';
import { amountHandler } from "@/modules/add-expense-module/amount.handler";

import { type ExpenseRecordDto } from "@/modules/add-expense-module/expense-record.dto";
import {
  EExpenseCategory,
  EExpenseCategoryLabel,
  IOnBeforeStart,
  Module, TMaybePromise, TModuleConstructor,
} from "@/base";
import { QuestionCollection } from "inquirer";

import { RootModule } from "@/modules/RootModule";
import { SummaryModule} from "@/modules/summary-module/SummaryModule";
import { summariseExpensesByTimeframes } from "@/helpers/summarizers.helpers";


export class AddExpenseModule extends Module implements IOnBeforeStart {
  name = 'AddExpenseModule'
  children: TModuleConstructor[] = [SummaryModule];
  parent = RootModule
  questions: QuestionCollection = [
    {
      message: 'What have you spent on?',
      name: 'category',
      type: 'list',
      default: 1,
      pageSize: 10,
      loop: false,
      suffix: '\n',
      choices: Object.keys(EExpenseCategory)
          .filter(_category => isNaN(Number(_category)))
          .map(_category => {
            return {
              name: EExpenseCategoryLabel[_category],
              value:  EExpenseCategory[_category]
            }
      }).concat([{ value: 'Back', name: chalk.yellowBright('Back') },])
    },
    {
      message: 'How much did it cost you?',
      name: 'amount',
      type: 'input',
      default: '0',
      when: _answers => _answers.category !== 'Back'
    },
    {
      message: `Comment ${chalk.gray('(Optional)')}`,
      name: 'comment',
      type: 'input',
      when: _answers => _answers.category !== 'Back'
    },
  ];

  async onInquiryEnd() {
    if (this.answers!.category === 'Back') return;
    await this.createRecord();
    const data = await db.getAll();
    const summary = summariseExpensesByTimeframes(data);
    this.displaySummary(summary)
    console.log(chalk.greenBright('\n\nRecord Added!'))
    setTimeout(() => this.back(), 2000)
  }

  onBeforeStart(): TMaybePromise<void> {
    console.clear()
  }

  async createRecord () {
    const { amount , category, comment = '' } = this.answers as ExpenseRecordDto
    await db.createRecord({
      amount: amountHandler(amount as string),
      category,
      comment
    })
  }

  displaySummary (_summary: ReturnType<typeof summariseExpensesByTimeframes>) {
    console.log('\nYou have spent:\n');
    console.log(_summary.lastWeek.toFixed(2), 'UAH in the last week');
    console.log(_summary.lastMonth.toFixed(2), 'UAH in the last month');
    console.log(_summary.lastSemiYear.toFixed(2), 'UAH in the last semi-year');
    console.log(_summary.lastYear.toFixed(2), 'UAH in the last year');
  }
}
