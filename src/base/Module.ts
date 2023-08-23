import {
    IAnswers, IBaseModule,
    IModuleConstructor,
    TMaybePromise,
    TNullable
} from "./types";
import inquirer, {QuestionCollection} from "inquirer";
import * as uuid from 'uuid'

export abstract class Module implements IBaseModule {
    id = uuid.v4()
    abstract name: string
    abstract parent: TNullable<IModuleConstructor>
    children: IModuleConstructor[] = []
    questions: QuestionCollection = []
    answers: TNullable<IAnswers> = null
    start(): Promise<void> {
        this.onBeforeStart ? this.onBeforeStart() : console.clear()
        return inquirer.prompt(this.questions)
            .then(_answers => {
                this.answers = _answers
                return _answers
            })
            .then(() => this.onInquiryEnd?.())
            .then(() => this.nextModuleResolver?.() || null)
            .then(_nextModuleConstructor => {
                if (_nextModuleConstructor != null) {
                    this.checkChildren(_nextModuleConstructor)
                    return new _nextModuleConstructor()
                }
            }).then(_nextModule => _nextModule?.start())
            .catch(console.error)
    }
    onInquiryEnd? (): TMaybePromise<unknown>
    nextModuleResolver? (): TMaybePromise<TNullable<IModuleConstructor>>
    onBeforeStart? (): TMaybePromise<void>
    back() {
        if (this.parent) {
            new this.parent().start()
        }
    }
    private checkChildren (_constructor: IModuleConstructor): never | void {
        if (!this.children.some(_child => _child === _constructor)) {
            throw ReferenceError(`${_constructor.name} is not declared as a child of ${this.name}`)
        }
    }
    protected suspend() {
        console.clear()
        process.exit(0)
    }
    static validateUUID (_input: string) {
        return uuid.validate(_input)
    }
}

class User {
    name: string
}

class Admin extends User {
}

const a: typeof User[] = [Admin, User]
new a[0]
