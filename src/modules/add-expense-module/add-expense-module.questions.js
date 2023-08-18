"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addExpenseModuleQuestions = void 0;
var types_js_1 = require("../../types.js");
var categories = [
    { value: types_js_1.EExpenseCategory.RENT, name: 'Rent' },
    { value: types_js_1.EExpenseCategory.FOOD, name: 'Food' },
    { value: types_js_1.EExpenseCategory.SELF_CARE, name: 'Self-care' },
    { value: types_js_1.EExpenseCategory.ENTERTAINMENT, name: 'Entertainment' },
    { value: types_js_1.EExpenseCategory.EDUCATION, name: 'Education' },
    { value: types_js_1.EExpenseCategory.CHARITY_DONATIONS, name: 'Charity & Donations' },
    { value: types_js_1.EExpenseCategory.PRESENTS, name: 'Presents' },
    { value: types_js_1.EExpenseCategory.INVESTMENTS, name: 'Investments' }
];
exports.addExpenseModuleQuestions = [
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
];
