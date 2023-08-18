function isLastWeek(_date: Date) {
    const currentDate = new Date();
    const lastWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7);
    return _date >= lastWeek && _date <= currentDate;
}

function isLastMonth(_date: Date) {
    const currentDate = new Date();
    const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate());
    return _date >= lastMonth && _date <= currentDate;
}

function isLastSemiYear(_date: Date) {
    const currentDate = new Date();
    const lastSemiYear = new Date(currentDate.getFullYear(), currentDate.getMonth() - 6, currentDate.getDate());
    return _date >= lastSemiYear && _date <= currentDate;
}

function isLastYear(_date: Date) {
    const currentDate = new Date();
    const lastYear = new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), currentDate.getDate());
    return _date >= lastYear && _date <= currentDate;
}

export {
    isLastWeek,
    isLastMonth,
    isLastSemiYear,
    isLastYear
}
