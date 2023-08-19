import {Answers, QuestionCollection} from "inquirer";

export type IAnswers = Answers

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

export type TNullable<T> = T | null
export type TMaybePromise<T> = Promise<T> | T


export interface IModuleOnInquiryEnd {
    onInquiryEnd(): TMaybePromise<unknown>
}

export interface INextModuleResolver {
    nextModuleResolver(): TMaybePromise<TNullable<IModuleConstructor>>
}
export interface IOnBeforeStart {
    onBeforeStart(): TMaybePromise<void>
}

export interface IBaseModule {
    id: string
    questions: QuestionCollection
    answers: TNullable<IAnswers>
    previousModuleAnswers: TNullable<IAnswers[]>
    start(): TMaybePromise<void>
}

export interface IModuleConstructor {
    new (): TMaybePromise<IBaseModule>
}

