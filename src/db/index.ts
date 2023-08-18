import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuid } from 'uuid';
import { IExpenseRecord } from '../types.js';
import { ExpenseRecordDto } from '../add-expense-module/expense-record.dto.js';

class ExpensesDatabase {
  dbPath = path.resolve('./expenses-table.json');

  async getAll(): Promise<IExpenseRecord[]> {
    const data = await readFile(this.dbPath);
    return JSON.parse(data.toString());
  }

  async createRecord(_expenseRecordDto: ExpenseRecordDto) {
    const { amount, category } = _expenseRecordDto;
    const record: IExpenseRecord = {
      amount: amount as number,
      category,
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
