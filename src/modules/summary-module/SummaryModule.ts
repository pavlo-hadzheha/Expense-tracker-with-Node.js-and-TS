import {
    IExpenseRecord,
    TModuleConstructor,
    IModuleOnInquiryEnd,
    INextModuleResolver,
    Module,
    TMaybePromise,
    TNullable
} from "@/base";
import { ESummaryOptions } from "@/modules/summary-module/summary-module.types";
import { RootModule } from "@/modules/RootModule";
import {
    summariseExpensesByCategory,
    summariseExpensesByCategoryAndTimeframes,
    summariseExpensesByTimeframes
} from "@/helpers/summarizers.helpers";
import { db } from "@/db";
import {add} from "@/helpers/add.helper";

export class SummaryModule extends Module implements IModuleOnInquiryEnd, INextModuleResolver {
    name: 'SummaryModule';
    children: TModuleConstructor[] = [RootModule];
    parent = RootModule
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

    data: IExpenseRecord[] = []

    async onInquiryEnd()  {
        if ([
            ESummaryOptions.BY_CATEGORY,
            ESummaryOptions.BY_CATEGORY_AND_TIMEFRAMES,
            ESummaryOptions.BY_TIMEFRAMES
        ].includes(this.answers?.summaryType)) {
            this.data = await db.getAll()
        }
        if (this.answers?.summaryType === ESummaryOptions.BY_CATEGORY) this.summariseByCategory()
        if (this.answers?.summaryType === ESummaryOptions.BY_TIMEFRAMES) this.summariseByTimeframe()
        if (this.answers?.summaryType === ESummaryOptions.BY_CATEGORY_AND_TIMEFRAMES) this.summariseByCategoryAndTimeframe()
        return null
    }

    nextModuleResolver(): TMaybePromise<TNullable<TModuleConstructor>> {
        if (this.answers?.summaryType === ESummaryOptions.BACK) return RootModule;
        if (this.answers?.summaryType === ESummaryOptions.CLOSE) this.suspend()
        return null
    }

    private summariseByCategory () {
        console.table(summariseExpensesByCategory(this.data, true), ['category', 'total'])
    }

    private summariseByTimeframe () {
        console.table(summariseExpensesByTimeframes(this.data))
    }


    private summariseByCategoryAndTimeframe() {
        const summary = summariseExpensesByCategoryAndTimeframes(this.data)
        const columnsToAddUp = ['total', 'lastWeek', 'lastMonth', 'lastSemiYear', 'lastYear', 'allTime'] as const
        const summaryTotals: Record<string, number | string> = {}
        summaryTotals.category = 'TOTAL'
        columnsToAddUp.forEach(_col => {
            summaryTotals[_col] = add(...summary.map(_row => _row[_col] as number))
        })
        console.table(summary.concat([summaryTotals as any]))
    }
}
