#!/usr/bin/env node --no-package

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// Try to resolve inquirer, and if it's not found, install it
try {
	require.resolve('inquirer')
} catch (error) {
	console.log('Installing libraries ([\'inquirer\'])...')
	execSync('npm install inquirer', { stdio: 'inherit' })
}
const inquirer = require('inquirer')
const readline = require('readline')

const rootDir = getGitRootDirPath()
const COMMIT_MESSAGES_JSON_PATH = path.normalize(`${rootDir}/scripts/commit-messages.json`)
const messages = JSON.parse(fs.readFileSync(COMMIT_MESSAGES_JSON_PATH, { encoding: 'utf-8' }))

selectCommitMessage()

async function selectCommitMessage () {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	})
	try {
		const answer = await inquirer.prompt([
			{
				type: 'list',
				name: 'commitMessage',
				message: 'Select a commit message:',
				choices: messages,
			},
		])

		const commitMessage = answer.commitMessage

		execSync(`git commit --amend -m "${commitMessage}"`)
		console.log(`Commit message set to: ${commitMessage}`)

		// Run npm run type-check after a successful commit message choice
		try {
			execSync('npm run type-check', { stdio: 'inherit' })
		} catch (error) {
			console.error('npm run type-check failed')
			process.exit(1)
		}
	} catch (error) {
		console.log('ERROR: ', error)
	} finally {
		rl.close()
	}
}

function getGitRootDirPath () {
	return execSync('git rev-parse --show-toplevel', { encoding: 'utf-8' }).trim()
}

