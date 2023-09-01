import { EExpenseCategory, TModuleConstructor, INextModuleResolver, Module, TMaybePromise, TNullable } from "@/base";
import { db } from "@/db";
import { ERecordsModuleOptions } from "@/modules/records-module/records-module.types";
import { RootModule } from "@/modules/RootModule";
import chalk from "chalk";

export class RecordsModule extends Module implements INextModuleResolver {
    name: 'RecordsModule'
    parent = RootModule

    nextModuleResolver(): TMaybePromise<TNullable<TModuleConstructor>> {
      if (Module.validateUUID(this.answers?.recordId)) {
        this.suspend()
      } else if (this.answers?.recordId === ERecordsModuleOptions.BACK) {
        this.back()
      }
      return null
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
        const comment = _record.comment ? `| ${_record.comment}` : ''
        return {
          value: _record.id,
          name: `${amount} UAH | ${category} | ${date} ${comment}`
        }
      })
      this.questions = [
            {
              message:  'Pick a record to see its actions',
              name: 'recordId',
              type: 'list',
              loop: false,
              pageSize: 10,
              choices: [
                  ...choices,
                  { name: chalk.yellowBright('Back'), value: ERecordsModuleOptions.BACK }
              ]
            }
      ]
    }
}
