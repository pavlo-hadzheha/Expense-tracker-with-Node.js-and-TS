import { EExpenseCategory, TModuleConstructor, INextModuleResolver, Module, TMaybePromise, TNullable, ECommonAction } from "@/base";
import { db } from "@/db";
import { RootModule } from "@/modules/RootModule";
import { RecordsActionModule } from "@/modules/records-module/RecordActionModule/RecordsActionModule";
import { QuestionCollection } from "inquirer";
import { CanGoBack } from "@/base/decorators";
import { CanClose } from "@/base/decorators";

enum EColLength {
  AMOUNT = 15,
  CATEGORY = 20,
  DATE = 15,
  DESCRIPTION = 50
}

enum EColHeader {
  AMOUNT = 'Amount (UAH)',
  CATEGORY = 'Category',
  DATE = 'Purchased on',
  DESCRIPTION = 'Details'
}

class RecordsModule extends Module implements INextModuleResolver {
  name: 'RecordsModule'
  parent = RootModule
  children = [RecordsActionModule]

  @CanGoBack('recordId')
  @CanClose('recordId')
  questions: QuestionCollection = [];

  nextModuleResolver(): TMaybePromise<TNullable<TModuleConstructor>> {
    if (RecordsModule.validateUUID(this.answers?.recordId)) {
      return RecordsActionModule
    } else if (this.answers?.recordId === ECommonAction.BACK) {
      this.back()
    }
    return null
  }

  override async start() {
    await this.initializeQuestions()
    await super.start()
  }

  createTableHeader() {
    const amount = EColHeader.AMOUNT.padEnd(EColLength.AMOUNT, ' ')
    const category = EColHeader.CATEGORY.padEnd(EColLength.CATEGORY, ' ')
    const date = EColHeader.DATE.padEnd(EColLength.DATE, ' ')
    const description = EColHeader.DESCRIPTION.padEnd(EColLength.DESCRIPTION, ' ')
    const header = `${amount} | ${category} | ${date} | ${description} |`
    const underline = ''.padEnd(header.length, '-')
    return header + '\n' + underline
  }

  private async initializeQuestions() {
    const records = await db.getAll()
    const choices = records.map(_record => {
      const amount = (_record.amount.toFixed(0) + ' UAH').padEnd(EColLength.AMOUNT, ' ')
      const category = EExpenseCategory[_record.category].padEnd(EColLength.CATEGORY, ' ')
      const date = new Date(_record.date).toLocaleDateString().padEnd(EColLength.DATE, ' ')
      const comment = (_record.comment || '').padEnd(EColLength.DESCRIPTION, ' ')
      return {
        value: _record.id,
        name: `${amount} | ${category} | ${date} | ${comment} |`
      }
    }).reverse()
    this.questions = [
      {
        message: 'Pick a record to see its actions',
        name: 'recordId',
        type: 'list',
        loop: false,
        suffix: `\n\n  ${this.createTableHeader()}`,
        pageSize: 10,
        choices
      }
    ]
  }
}

export { RecordsModule as RecordsModule }