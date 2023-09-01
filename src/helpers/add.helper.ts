export function add (..._nums: number[]): number {
    return _nums.reduce((_total, _current) => {
                return _total + _current
            }, 0)
}
