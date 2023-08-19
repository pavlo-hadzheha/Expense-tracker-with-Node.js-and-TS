import { db } from '../../db';
import { isLastMonth, isLastSemiYear, isLastWeek, isLastYear } from '../../helpers';
import { amountHandler } from "./amount.handler";

import { type ExpenseRecordDto } from "./expense-record.dto";
import {
    EExpenseCategory,
    IExpenseRecord,
    IModuleConstructor,
    INextModuleResolver,
    IOnBeforeStart,
    Module,
    TNullable
} from "../../base";
import {QuestionCollection} from "inquirer";
import chalk from "chalk";
import {RootModule} from "../RootModule";


export class AddExpenseModule extends Module implements INextModuleResolver, IOnBeforeStart {
  name = 'AddExpenseModule'
  children: IModuleConstructor[] = [RootModule];
  questions: QuestionCollection = [
    {
      message: 'What have you spent on?',
      name: 'category',
      type: 'list',
      default: 1,
      pageSize: Infinity,
      loop: false,
      suffix: '\n',
      choices: [
        { value: EExpenseCategory.RENT, name: 'Rent' },
        { value: EExpenseCategory.FOOD, name: 'Food' },
        { value: EExpenseCategory.SELF_CARE, name: 'Self-care' },
        { value: EExpenseCategory.ENTERTAINMENT, name: 'Entertainment' },
        { value: EExpenseCategory.EDUCATION, name: 'Education' },
        { value: EExpenseCategory.CHARITY_DONATIONS, name: 'Charity & Donations' },
        { value: EExpenseCategory.PRESENTS, name: 'Presents' },
        { value: EExpenseCategory.INVESTMENTS, name: 'Investments' },
        { value: Infinity, name: chalk.yellowBright('Back') },
      ]
    },
    {
      message: 'How much did it cost you?',
      name: 'amount',
      type: 'input',
      default: '0',
      when: _answers => _answers.category !== Infinity
    },
  ];

  nextModuleResolver(): TNullable<IModuleConstructor> {
    if (this.answers?.category === Infinity) return RootModule
    return null;
  }

  async onInquiryEnd() {
    if (this.answers?.category === Infinity) return;
    await this.createRecord();
    const data = await db.getAll();
    const summary = this.summarise(data);
    this.displaySummary(summary)
  }

  async createRecord () {
    const { amount , category } = this.answers as ExpenseRecordDto
    await db.createRecord({
      amount: amountHandler(amount as string),
      category
    })
  }

  summarise(_data: IExpenseRecord[]) {
    return _data.reduce((_acc, _cur) => {
      const date = new Date(_cur.date);
      const amount = _cur.amount || 0;
      if (isLastYear(date)) _acc.lastYear += amount;
      if (isLastSemiYear(date)) _acc.lastSemiYear += amount;
      if (isLastMonth(date)) _acc.lastMonth += amount;
      if (isLastWeek(date)) _acc.lastWeek += amount;
      return _acc;
    }, {
      lastYear: 0,
      lastSemiYear: 0,
      lastMonth: 0,
      lastWeek: 0,
    });
  }

  displaySummary (_summary: ReturnType<typeof this.summarise>) {
    console.log('\nYou have spent:\n');
    console.log(_summary.lastWeek.toFixed(2), 'UAH in the last week');
    console.log(_summary.lastMonth.toFixed(2), 'UAH in the last month');
    console.log(_summary.lastSemiYear.toFixed(2), 'UAH in the last semi-year');
    console.log(_summary.lastYear.toFixed(2), 'UAH in the last year');
  }
}
