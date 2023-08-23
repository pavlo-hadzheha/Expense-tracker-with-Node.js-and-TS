import { EExpenseCategory } from "../../base";

export class ExpenseRecordDto {
    amount: number | string
    category: EExpenseCategory
    comment?: string
}
