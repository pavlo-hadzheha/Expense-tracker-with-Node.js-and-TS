import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuid } from 'uuid';
import { ExpenseRecordDto } from '../modules/add-expense-module/expense-record.dto';
import {IExpenseRecord} from "../base";

class ExpensesDatabase {
  dbPath = path.resolve('./expenses-table.json');

  async getAll(): Promise<IExpenseRecord[]> {
    const data = await readFile(this.dbPath);
    return JSON.parse(data.toString());
  }

  async createRecord(_expenseRecordDto: ExpenseRecordDto) {
    const { amount, category, comment } = _expenseRecordDto;
    const record: IExpenseRecord = {
      amount: amount as number,
      category,
      comment,
      date: new Date().toISOString(),
      id: uuid(),
    };
    const data = await this.getAll();
    data.push(record);
    await writeFile(this.dbPath, JSON.stringify(data));
    return record;
  }
}

export const db = new ExpensesDatabase();
