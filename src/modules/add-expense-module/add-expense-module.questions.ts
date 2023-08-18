import {EExpenseCategory} from "../../base";

const categories = [
    { value: EExpenseCategory.RENT, name: 'Rent' },
    { value: EExpenseCategory.FOOD, name: 'Food' },
    { value: EExpenseCategory.SELF_CARE, name: 'Self-care' },
    { value: EExpenseCategory.ENTERTAINMENT, name: 'Entertainment' },
    { value: EExpenseCategory.EDUCATION, name: 'Education' },
    { value: EExpenseCategory.CHARITY_DONATIONS, name: 'Charity & Donations' },
    { value: EExpenseCategory.PRESENTS, name: 'Presents' },
    { value: EExpenseCategory.INVESTMENTS, name: 'Investments' }
]
export const addExpenseModuleQuestions = [
    {
        message: 'What have you spent on?',
        name: 'category',
        type: 'list',
        default: 1,
        choices: categories
    },
    {
        message: 'How much did it cost you?',
        name: 'amount',
        type: 'input',
        default: '0'
    },
]
