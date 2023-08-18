export type IAnswer = Record<string, any>
export type TNullable<T> = T | null

export enum EExpenseCategory {
    RENT=1 ,
    FOOD,
    SELF_CARE,
    ENTERTAINMENT,
    EDUCATION,
    CHARITY_DONATIONS,
    PRESENTS,
    INVESTMENTS
}

export interface IExpenseRecord {
    id: string
    amount: number
    category: EExpenseCategory
    date: string
}

export interface IModule {
    id: string
    questions: IAnswer[]
    children?: IModuleConstructor[]
    nextModuleResolver?: (_answers: IAnswer[]) => TNullable<IModuleConstructor>
    onInquiryEnd?: (_answers: IAnswer[]) => unknown
    previousModuleAnswers: TNullable<IAnswer[]>
    start(): void
}


export interface IModuleConstructor {
    new (previousModuleAnswers: TNullable<IAnswer[]>): IModule
}
