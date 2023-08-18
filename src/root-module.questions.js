"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rootModuleQuestions = exports.EStartMenuOption = void 0;
var EStartMenuOption;
(function (EStartMenuOption) {
    EStartMenuOption[EStartMenuOption["SHOW_ALL_RECORDS"] = 1] = "SHOW_ALL_RECORDS";
    EStartMenuOption[EStartMenuOption["CLOSE"] = 2] = "CLOSE";
    EStartMenuOption[EStartMenuOption["ADD_RECORD"] = 3] = "ADD_RECORD";
    EStartMenuOption[EStartMenuOption["SHOW_SUMMARY"] = 4] = "SHOW_SUMMARY";
})(EStartMenuOption || (exports.EStartMenuOption = EStartMenuOption = {}));
exports.rootModuleQuestions = [
    {
        message: 'What can I do for you?',
        name: 'action',
        type: 'list',
        default: EStartMenuOption.SHOW_ALL_RECORDS,
        choices: [
            { name: 'Show all records', value: EStartMenuOption.SHOW_ALL_RECORDS },
            { name: 'Add expense record', value: EStartMenuOption.ADD_RECORD },
            { name: 'Show summary', value: EStartMenuOption.SHOW_SUMMARY },
            { name: 'Close', value: EStartMenuOption.CLOSE },
        ],
    },
];
