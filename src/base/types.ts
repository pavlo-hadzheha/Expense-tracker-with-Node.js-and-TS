import { Answers, QuestionCollection } from "inquirer";

export type IAnswers = Answers

export enum ECommonAction {
    BACK = 'COMOON-BACK',
    CLOSE = 'COMOON-CLOSE'
}

export enum EExpenseCategory {
    RENT = 1,
    FOOD,
    SELF_CARE,
    ENTERTAINMENT,
    EDUCATION,
    CHARITY_DONATIONS,
    PRESENTS,
    INVESTMENTS,
    CLOTHES,
    TRANSPORTATION,
    HOME_APPLIANCES,
    TAXES_FOP
}

export enum EExpenseCategoryLabel {
    RENT = "Rent",
    FOOD = "Food",
    SELF_CARE = "Self-care",
    ENTERTAINMENT = "Entertainment",
    EDUCATION = "Education",
    CHARITY_DONATIONS = "Charity & Donations",
    PRESENTS = "Presents",
    INVESTMENTS = "Investments",
    CLOTHES = "Clothes",
    TRANSPORTATION = "Transportation",
    HOME_APPLIANCES = "Home Appliances",
    TAXES_FOP = "FOP Taxes"
}

export interface IExpenseRecord {
    id: string
    amount: number
    category: EExpenseCategory
    date: string
    comment?: string
}

export type TNullable<T> = T | null
export type TMaybePromise<T> = Promise<T> | T


export interface IModuleOnInquiryEnd {
    onInquiryEnd(): TMaybePromise<unknown>
}

export interface INextModuleResolver {
    nextModuleResolver(): TMaybePromise<TNullable<TModuleConstructor>>
}
export interface IOnBeforeStart {
    onBeforeStart(): TMaybePromise<void>
}

export interface IBaseModule {
    id: string
    children: TModuleConstructor[]
    parent: TNullable<TModuleConstructor>
    questions: QuestionCollection
    answers: TNullable<IAnswers>
    start(): TMaybePromise<void>
}

export type TConstructor<T = {}> = new (...args: any[]) => T

export type TModuleConstructor = TConstructor<IBaseModule>

