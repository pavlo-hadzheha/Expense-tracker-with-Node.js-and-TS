import { v4 as uuid } from 'uuid';
import {
    IAnswers,
    IBaseModule,
    IModuleConstructor,
    TMaybePromise,
    TNullable
} from "./types";
import inquirer, {QuestionCollection} from "inquirer";

export abstract class Module implements IBaseModule {
    id = uuid()
    children: IModuleConstructor[] = []
    questions: QuestionCollection = []
    answers: IAnswers
    constructor(public previousModuleAnswers: TNullable<IAnswers[]> = null) {}
    onInquiryEnd? (): TMaybePromise<unknown>
    nextModuleResolver? (): TMaybePromise<TNullable<IModuleConstructor>>
    start(): Promise<void> {
        return inquirer.prompt(this.questions)
            .then(_answers => {
                this.answers = _answers
                return _answers
            })
            .then(() => this.onInquiryEnd && this.onInquiryEnd())
            .then(() => this.nextModuleResolver
                        ? this.nextModuleResolver()
                        : null)
            .then(_nextModuleConstructor => {
                if (_nextModuleConstructor != null) {
                    return new _nextModuleConstructor()
                }
            }).then(_nextModule => {
                if(_nextModule) {
                    _nextModule.start();
                }
            }).catch(console.error)
    }
    protected suspend() {
        console.clear()
        process.exit(0)
    }
}
