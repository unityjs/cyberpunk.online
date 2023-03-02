
/** 获取数组下标值或最后一个值 */
export function GetItemOrLast<T>(arr: T[], index: number): T {
    if (index >= arr.length) index = arr.length - 1
    return arr[index]
}

/** 获取子版本 */
export function GetSubVersion(version: string, level: number): number {
    return Number(version.split('.')[level]) || 0
}

/** 版本差异 */
export function VersionDiff(versionA: string, versionB: string, level: number): number {
    return GetSubVersion(versionA, level) - GetSubVersion(versionB, level)
}

/** 检测版本 */
export function CheckVersion(version: string, minVersion: string, maxVersion: string = null): boolean {
    if (version == null || minVersion == null) return false
    const arrV = version.split('.')
    const arrMin = minVersion.split('.')
    const arrMax = maxVersion?.split('.')
    for (var i = 0; i < arrV.length; ++i) {
        var v = Number(arrV[i]) || 0
        var min = Number(arrMin[i]) || 0
        if (v < min) return false
        var max = Number(arrMax?.[i]) || 0
        if (max > 0 && v > max) return false
    }
    return true
}