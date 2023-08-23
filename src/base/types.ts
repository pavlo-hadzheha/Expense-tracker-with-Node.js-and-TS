import { Answers, QuestionCollection } from "inquirer";

export type IAnswers = Answers

export enum EExpenseCategory {
    RENT = 1 ,
    FOOD,
    SELF_CARE,
    ENTERTAINMENT,
    EDUCATION,
    CHARITY_DONATIONS,
    PRESENTS,
    INVESTMENTS,
    CLOTHES,
    TRANSPORTATION
}

export enum EExpenseCategoryLabel {
    RENT = "Rent" ,
    FOOD = "Food",
    SELF_CARE = "Self-care",
    ENTERTAINMENT = "Entertainment",
    EDUCATION = "Education",
    CHARITY_DONATIONS = "Charity & Donations",
    PRESENTS = "Presents",
    INVESTMENTS = "Investments",
    CLOTHES = "Clothes",
    TRANSPORTATION = "Transportation"
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
    nextModuleResolver(): TMaybePromise<TNullable<IModuleConstructor>>
}
export interface IOnBeforeStart {
    onBeforeStart(): TMaybePromise<void>
}

export interface IBaseModule {
    id: string
    questions: QuestionCollection
    answers: TNullable<IAnswers>
    start(): TMaybePromise<void>
}

export interface IModuleConstructor {
    new (): IBaseModule
}

