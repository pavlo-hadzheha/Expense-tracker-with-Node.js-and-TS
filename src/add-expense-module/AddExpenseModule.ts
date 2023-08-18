import { v4 as uuid } from 'uuid';
import inquirer from 'inquirer';

import { addExpenseModuleQuestions } from './add-expense-module.questions.js';
import { db } from '../db/index.js';
import { isLastMonth, isLastSemiYear, isLastWeek, isLastYear } from '../helpers/index.js';
import { amountHandler } from "./amount.handler.js";

import { type ExpenseRecordDto } from "./expense-record.dto.js";
import type {
  IAnswer,
  IExpenseRecord,
  IModule,
  IModuleConstructor,
  TNullable,
} from '../types';


export class AddExpenseModule implements IModule {
  id = uuid();
  children: IModuleConstructor[] = [];
  questions = addExpenseModuleQuestions;

  constructor(
    public previousModuleAnswers: TNullable<IAnswer[]> = null,
  ) {}

  nextModuleResolver(_answers: IAnswer[]): TNullable<IModuleConstructor> {
    return null;
  }

  async onInquiryEnd(_answers: IAnswer) {
    const {amount , category} = _answers as ExpenseRecordDto

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

  async start(): Promise<void> {
    const answers: IAnswer[] = await inquirer.prompt(this.questions);
    await this.onInquiryEnd(answers);
    const nextModule = this.nextModuleResolver(answers);
    if (nextModule != null) {
      new nextModule(answers).start();
    }
  }
}
