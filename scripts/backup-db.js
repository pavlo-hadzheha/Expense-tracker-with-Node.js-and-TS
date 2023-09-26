import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
console.log(import.meta)

const BACKUP_DB_PATH = path.join(__dirname, '../expenses-table.json')
const SOURCE_DB_PATH = path.join(__dirname, '../_expenses-table.json')


const sourceReadStream = fs.createReadStream(SOURCE_DB_PATH, {
	encoding: 'utf-8',
	highWaterMark: 64
})


const backupWriteStream = fs.createWriteStream(BACKUP_DB_PATH)

sourceReadStream.pipe(backupWriteStream)
