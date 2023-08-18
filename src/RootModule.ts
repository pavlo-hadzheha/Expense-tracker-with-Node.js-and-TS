import { v4 as uuid } from 'uuid';
import inquirer from 'inquirer';

import { AddExpenseModule } from './add-expense-module/AddExpenseModule.js';
import { EStartMenuOption, rootModuleQuestions } from './root-module.questions.js';

import type { IAnswer, IModule, IModuleConstructor, TNullable } from './types.js';

export const RootModule=  class implements IModule {
  id = uuid();

  children: IModuleConstructor[] = [AddExpenseModule];

  questions = rootModuleQuestions;

  constructor(
    public previousModuleAnswers: TNullable<IAnswer[]> = null,
  ) {}

  static nextModuleResolver(_answers: IAnswer): TNullable<IModuleConstructor> {
    if (_answers.action === EStartMenuOption.ADD_RECORD) return AddExpenseModule;
    return null;
  }

  static onInquiryEnd(): unknown {
    return null;
  }

  async start(): Promise<void> {
    const answers: IAnswer[] = await inquirer.prompt(this.questions);
    await RootModule.onInquiryEnd();
    const NextModule = RootModule.nextModuleResolver(answers);
    if (NextModule != null) {
      new NextModule(answers).start();
    }
  }
}
