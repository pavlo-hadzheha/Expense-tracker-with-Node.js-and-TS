import fs from 'fs'
import { v4 as uuid } from 'uuid'
import inquirer from 'inquirer'
import { questions } from './questions.js'
import { amountHandler } from './amount.handler.js'

import {
	isLastYear,
	isLastSemiYear,
	isLastMonth,
	isLastWeek
} from './date.helpers.js'

const tablePath = './expenses-table.json'
let expensesTable

main()

function main () {
	console.clear()
	readExpensesTable()

	inquirer.prompt(questions).then(_answers => {
		_answers.amount = amountHandler(_answers.amount)
		_answers.id = uuid()
		_answers.date = new Date().toISOString()
		expensesTable.push(_answers)
		saveExpensesTable()
		return expensesTable
	})
}

function summariseExpensesTable() {
	const summary = expensesTable.reduce((_acc, _cur) => {
		const date = new Date(_cur.date)
		if (isLastYear(date)) _acc.lastYear += _cur.amount || 0
		if (isLastSemiYear(date)) _acc.lastSemiYear += _cur.amount || 0
		if (isLastMonth(date)) _acc.lastMonth += _cur.amount || 0
		if (isLastWeek(date)) _acc.lastWeek += _cur.amount || 0
		return _acc
	}, {
		lastYear: 0,
		lastSemiYear: 0,
		lastMonth: 0,
		lastWeek: 0
	})
	console.log()
	console.log('You have spent:\n')
	console.log(summary.lastWeek.toFixed(2), 'UAH in the last week')
	console.log(summary.lastMonth.toFixed(2), 'UAH in the last month')
	console.log(summary.lastSemiYear.toFixed(2), 'UAH in the last semi-year')
	console.log(summary.lastYear.toFixed(2), 'UAH in the last year')
}


function saveExpensesTable() {
	fs.writeFile(tablePath, JSON.stringify(expensesTable), () => {
		console.log('\nRecord added!')
		summariseExpensesTable()
	})
}

function readExpensesTable() {
	fs.closeSync(fs.openSync(tablePath, 'a'))
	fs.readFile(tablePath, (err, tableJson) => {
		if (tableJson.length) {
			expensesTable = JSON.parse(tableJson)
		}
	})
}
