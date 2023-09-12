import {IModuleOnInquiryEnd, INextModuleResolver, Module, TMaybePromise, TModuleConstructor, TNullable} from "@/base";
import { QuestionCollection } from "inquirer";
import chalk from "chalk";
import { ERecordsModuleOptions } from "@/modules/records-module/records-module.types";
import { RecordsModule } from "@/modules/records-module/RecordsModule";
import {ERecordAction} from "@/modules/records-module/RecordActionModule/actions.enum";

export class RecordsActionModule extends Module implements IModuleOnInquiryEnd, INextModuleResolver {
    name = 'RecordsActionModule'
    parent = RecordsModule
    questions: QuestionCollection = [
        {
            message:  'Actions',
            name: 'action',
            type: 'list',
            loop: false,
            pageSize: 10,
            choices: [
                { name: chalk.greenBright('Edit'), value: ERecordAction.EDIT },
                { name: chalk.redBright('Delete'), value: ERecordAction.DELETE },
                { name: chalk.yellowBright('Back'), value: ERecordsModuleOptions.BACK }
            ]
        }
    ]
    onInquiryEnd(): void {
        if (this.answers?.action === ERecordsModuleOptions.BACK) {
            this.back()
        }
    }
    nextModuleResolver(): TMaybePromise<TNullable<TModuleConstructor>> {
        if (this.answers?.action === ERecordAction.EDIT) {
            this.suspend()
        } else if (this.answers?.action === ERecordAction.DELETE) {
            this.suspend()
        }
        return null
    }
}
