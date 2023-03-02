
/** 回应测试 */
export class ResponseTest {
    totalTime: number = 0
    count: number = 0
    perTime: number = 0
    perCount: number = 0
    private startTime: number = Date.now()

    add(testTime: number) {
        this.totalTime += testTime
        this.count++
        var deltaTime = Date.now() - this.startTime
        if (this.count >= 100 && deltaTime > 10000) {
            this.perTime = this.totalTime / this.count
            this.perCount = this.count * 1000 / deltaTime
            this.count = 0
            this.startTime = Date.now()
        }
    }
}