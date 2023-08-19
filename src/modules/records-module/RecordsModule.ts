import {EExpenseCategory, IModuleConstructor, INextModuleResolver, Module, TMaybePromise, TNullable} from "../../base";
import { db } from "../../db";
import {ERecordsModuleOptions} from "./records-module.types";
import {RootModule} from "../RootModule";
import chalk from "chalk";

export class RecordsModule extends Module implements INextModuleResolver {
    name: 'RecordsModule'
    children: IModuleConstructor[] = [RootModule]

    nextModuleResolver(): TMaybePromise<TNullable<IModuleConstructor>> {
        if (Module.validateUUID(this.answers.recordId)) {
            this.suspend()
        } else if (this.answers.recordId === ERecordsModuleOptions.BACK) {
            return RootModule
        } else {
            return null
        }
    }

    override async start () {
        await this.initializeQuestions()
        await super.start()
    }

    private async initializeQuestions () {
        const records = await db.getAll()
        const choices = records.map(_record => {
            const date = new Date(_record.date).toLocaleDateString()
            const category = EExpenseCategory[_record.category]
            const amount = _record.amount.toFixed(0)
            return {
                value: _record.id,
                name: `${amount} UAH | ${category} | ${date}`
            }
        })
        this.questions = [
            {
              message:  'Pick a record to see its actions',
              name: 'recordId',
              type: 'list',
              pageSize: Infinity,
              choices: [
                  ...choices,
                  { name: chalk.yellowBright('Back'), value: ERecordsModuleOptions.BACK }
              ]
            }
        ]
    }
}
