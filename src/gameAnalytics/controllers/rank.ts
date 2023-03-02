import { floatFixed } from "../../utils/time"
import { AppData } from "../AppData"

function getNumberBit(num) {
    let bit = 0
    while (num > 0) {
        num >>= 1
        ++bit
    }
    return bit
}


export async function rankUpdate(query: { appData: AppData, key: string, lastScore: any, score: any, id: any, name: string, expand: any }) {
    let lastScore = parseFloat(query.lastScore) || 0// 上一次上报的分值
    let score = parseFloat(query.score)// 分值
    const { id, name, expand } = query

    if (!query.appData.db.ranks.has(query.key))
        query.appData.db.ranks.set(query.key, { top: [], total: 0, counter: [] })

    const rankData = query.appData.db.ranks.get(query.key)
    const { counter, top } = rankData

    const topCount = top.length
    const minScore = topCount > 0 ? top[topCount - 1].score : 0// top100最小分值
    // 去除老排名计数
    if (lastScore > 0) {
        let bit = Math.ceil(Math.log2(lastScore + 1))
        counter[bit] = (counter[bit] || 0) - 1
    } else ++rankData.total//新排名成员累加
    // 加入新排名计数
    if (score > 0) {
        let bit = Math.ceil(Math.log2(lastScore + 1))
        counter[bit] = (counter[bit] || 0) + 1
    }
    // top100更新
    if (score >= minScore || topCount < 100) {
        let i = 0
        for (; i < topCount; ++i) {
            let item = top[i]
            if (item.id == id) {
                top.splice(i, 1)
                break
            }
        }
        if (i == topCount && topCount >= 100) {
            top.splice(99)
        }
    }
    if (top.length < 100) {
        top.push({ id, score, name, expand, time: Date.now() })
        top.sort((a, b) => b.score - a.score)
    }
}

export async function rankTop(query: { appData: AppData, key: string }) {
    return query.appData.db.ranks.get(query.key)?.top
}

export async function rankSelf(query: { appData: AppData, key: string, id: any, score: any }) {
    var rankData = query.appData.db.ranks.get(query.key)
    if (rankData == null) {
        return { rank: 0, over: 1 }
    }

    let id = query.id// 用户ID
    let score = parseFloat(query.score)// 分值
    let counter = rankData.counter
    let top = rankData.top
    let topCount = top.length
    let minScore = topCount > 0 ? top[topCount - 1].score : 0// top100最小分值
    let rank = topCount
    // top100
    if (score >= minScore) {
        for (let i = 0; i < topCount; ++i) {
            if (top[i].id == id) {
                rank = i
                break
            }
        }
    }
    // top外
    if (rank >= topCount) {
        let bit = getNumberBit(score)
        let scoreMax = (1 << bit) || 0
        let scoreMin = bit > 0 ? ((1 << (bit - 1)) || 0) : 0
        //lerp
        rank = Math.floor((counter[bit] || 0) * (score - scoreMin) / (scoreMax - scoreMin))
        --bit
        for (; bit >= 0; --bit) rank += (counter[bit] || 0)
        rank = rankData.total - rank
    }

    return { rank: rank, over: floatFixed((rankData.total - rank) / rankData.total, 4) }
}
