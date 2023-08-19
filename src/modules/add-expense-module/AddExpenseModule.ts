import { db } from '../../db';
import { isLastMonth, isLastSemiYear, isLastWeek, isLastYear } from '../../helpers';
import { amountHandler } from "./amount.handler";

import { type ExpenseRecordDto } from "./expense-record.dto";
import {EExpenseCategory, IExpenseRecord, IModuleConstructor, INextModuleResolver, Module, TNullable} from "../../base";
import {QuestionCollection} from "inquirer";
import chalk from "chalk";
import {RootModule} from "../RootModule";


export class AddExpenseModule extends Module implements INextModuleResolver {
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
    if (this.answers.category === Infinity) return RootModule
    return null;
  }

  async onInquiryEnd() {
    if (this.answers.category === Infinity) return
    const { amount , category } = this.answers as ExpenseRecordDto

    await db.createRecord({
      amount: amountHandler(amount as string),
      category
    })

    const data = await db.getAll();
    const summary = AddExpenseModule.summarise(data);
    console.log();
    console.log('You have spent:\n');
    console.log(summary.lastWeek.toFixed(2), 'UAH in the last week');
    console.log(summary.lastMonth.toFixed(2), 'UAH in the last month');
    console.log(summary.lastSemiYear.toFixed(2), 'UAH in the last semi-year');
    console.log(summary.lastYear.toFixed(2), 'UAH in the last year');
    return null;
  }

  static summarise(_data: IExpenseRecord[]) {
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
}
