import chalk from "chalk";

export function amountHandler (_amount: string) {
    if (+_amount) {
        return +_amount
    } else {
        try {
            const res = eval(_amount)
            if (Number.isFinite(res)) return res
            else throw new TypeError()
        } catch {
            onError()
        }
    }
}

function onError () {
    console.log(chalk.redBright('Amount must be a number or a valid arithmetic JS expression resulting in a number'))
    process.exit(1)
}
