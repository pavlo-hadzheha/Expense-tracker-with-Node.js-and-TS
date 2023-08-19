import {
    IModuleConstructor,
    IModuleOnInquiryEnd,
    INextModuleResolver,
    Module,
    TMaybePromise,
    TNullable
} from "../../base";
import { ESummaryOptions } from "./summary-module.types";
import { RootModule } from "../RootModule";

export class SummaryModule extends Module implements IModuleOnInquiryEnd, INextModuleResolver{
    name: 'SummaryModule';
    children: IModuleConstructor[] = [RootModule];
    questions = [
        {
            message: 'How do you want your data summarized?',
            name: 'summaryType',
            type: 'list',
            default: ESummaryOptions.BY_CATEGORY,
            choices: [
                { name: 'By category', value: ESummaryOptions.BY_CATEGORY },
                { name: 'By timeframes', value: ESummaryOptions.BY_TIMEFRAMES },
                { name: 'By category and timeframes', value: ESummaryOptions.BY_CATEGORY_AND_TIMEFRAMES },
                { name: 'Back', value: ESummaryOptions.BACK },
                { name: 'Close', value: ESummaryOptions.CLOSE },
            ],
        },
    ];
    onInquiryEnd()  {
        if (this.answers.summaryType === ESummaryOptions.BY_CATEGORY) this.summariseByCategory()
        if (this.answers.summaryType === ESummaryOptions.BY_TIMEFRAMES) this.summariseByTimeframe()
        if (this.answers.summaryType === ESummaryOptions.BY_CATEGORY_AND_TIMEFRAMES) this.summariseByCategoryAndTimeframe()
        return null
    }

    nextModuleResolver(): TMaybePromise<TNullable<IModuleConstructor>> {
        if (this.answers.summaryType === ESummaryOptions.BACK) return RootModule;
        if (this.answers.summaryType === ESummaryOptions.CLOSE) this.suspend()
        return null
    }

    summariseByCategory () {
        console.log('By Category')
    }

    summariseByTimeframe () {
        console.log('By Timeframes')
    }

    summariseByCategoryAndTimeframe() {
        console.log('By category and timeframes')
    }
}
