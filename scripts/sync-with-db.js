import dotenv from 'dotenv'

import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'

dotenv.config()
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const API_URL = process.env.APP_DOMAIN
const SOURCE = path.join(__dirname, '../_expenses-table.json')
const data = JSON.parse(fs.readFileSync(SOURCE, 'utf-8'))


async function main() {
	const token = await getAuthToken()
	const records = await Promise.all(data.map(_record => {
		const {category = '', amount, comment, date} = _record
		const payload = JSON.stringify({
			category,
			amount,
			comment: comment ?? '',
			date
		})
		return postExpenseRecord(payload, token)
	}))
	console.log({records});
}

main()

function postExpenseRecord (record, token) {
	return fetch(`${API_URL}/expenses`, {
		method: 'POST',
		body: record,
		headers: {
			'Authorization': `Bearer ${token}`,
			'Content-type': 'application/json'
		},
		redirect: 'follow'
	})
		.then(response => response.json())
}

function getAuthToken () {
	return fetch(`${API_URL}/auth/signin`, {
		method: 'POST',
		body: JSON.stringify({
			username: process.env.API_DOMAIN_USERNAME,
			password: process.env.API_DOMAIN_PASSWORD,
		}),
		headers: {
			'Content-type': 'application/json; charset=UTF-8'
		}
	})
		.then(response => response.text())
}


