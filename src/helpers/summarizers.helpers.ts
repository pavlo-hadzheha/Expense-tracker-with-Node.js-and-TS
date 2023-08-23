import {EExpenseCategory, EExpenseCategoryLabel, IExpenseRecord} from "../base";
import {isLastMonth, isLastSemiYear, isLastWeek, isLastYear} from "./date.helpers";
import {group, sort} from "radash";

export function summariseExpensesByTimeframes(_data: IExpenseRecord[]) {
    return _data.reduce((_acc, _cur) => {
        const date = new Date(_cur.date);
        const amount = _cur.amount || 0;
        if (isLastYear(date)) _acc.lastYear += amount;
        if (isLastSemiYear(date)) _acc.lastSemiYear += amount;
        if (isLastMonth(date)) _acc.lastMonth += amount;
        if (isLastWeek(date)) _acc.lastWeek += amount;
        return _acc;
    }, {
        lastWeek: 0,
        lastMonth: 0,
        lastSemiYear: 0,
        lastYear: 0,
    });
}

export function summariseExpensesByCategory (_data: IExpenseRecord[], _descending = false) {
    const byCategory =  group(_data, _expense => _expense.category)
    const summary = Object.entries(byCategory).map(([_category, _expenses]) => {
        const category = Number(_category) as EExpenseCategory
        const total = _expenses.reduce((_acc, _expense) => {
            return _acc + _expense.amount
        }, 0)
        return { total, category: EExpenseCategoryLabel[EExpenseCategory[category]] }
    })
    return sort(summary, _entry => _entry.total, _descending)
}

export function summariseExpensesByCategoryAndTimeframes (_data: IExpenseRecord[]) {
    const byCategory =  group(_data, _expense => _expense.category)
    const summary = Object.entries(byCategory).map(([_category, _expenses]) => {
        const category = Number(_category) as EExpenseCategory
        const byTimeframes = summariseExpensesByTimeframes(_expenses)
        const total = _expenses.reduce((_acc, _expense) => {
            return _acc + _expense.amount
        }, 0)
        return {
            total,
            category: EExpenseCategoryLabel[EExpenseCategory[category]],
            ...byTimeframes
        }
    })
    return sort(summary, _entry => _entry.total, true)
}
