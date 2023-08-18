"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLastYear = exports.isLastSemiYear = exports.isLastMonth = exports.isLastWeek = void 0;
function isLastWeek(_date) {
    var currentDate = new Date();
    var lastWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7);
    return _date >= lastWeek && _date <= currentDate;
}
exports.isLastWeek = isLastWeek;
function isLastMonth(_date) {
    var currentDate = new Date();
    var lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate());
    return _date >= lastMonth && _date <= currentDate;
}
exports.isLastMonth = isLastMonth;
function isLastSemiYear(_date) {
    var currentDate = new Date();
    var lastSemiYear = new Date(currentDate.getFullYear(), currentDate.getMonth() - 6, currentDate.getDate());
    return _date >= lastSemiYear && _date <= currentDate;
}
exports.isLastSemiYear = isLastSemiYear;
function isLastYear(_date) {
    var currentDate = new Date();
    var lastYear = new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), currentDate.getDate());
    return _date >= lastYear && _date <= currentDate;
}
exports.isLastYear = isLastYear;
