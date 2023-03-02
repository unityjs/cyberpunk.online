
/** 权重随机 */
export class WeightRandom {
    weights: number[]
    totalWeight: number = 0
    constructor(weights: number[]) {
        this.weights = weights;
        weights.forEach(t => this.totalWeight += t);
    }
    random(): number {
        let randVal = Math.random() * this.totalWeight
        for (let index = 0; index < this.weights.length; ++index) {
            randVal -= this.weights[index]
            if (randVal < 0)
                return index
        }
    }

    static random(weights: number[]): number {
        return (new WeightRandom(weights)).random()
    }
}

/** 返回一个大于等于所指定最小值、小于所指定最大值的非负随机数 */
function Range(min: number, max: number): number {
    return min + Math.random() * (max - min);
}

/** 返回一个大于等于所指定最小值、小于所指定最大值的随机整数 */
function RangeInteger(min: number, max: number): number {
    return Math.floor(Range(Math.floor(min), Math.floor(max)));
}

/** 随机整数，!!! 包含Max, 获得Min或Max的概率为 0.5/(Max - Min) */
export function GetRandomNum(Min, Max): number {
    var Range = Max - Min
    var Rand = Math.random()
    return (Min + Math.round(Rand * Range))
}

export default { Range, RangeInteger }