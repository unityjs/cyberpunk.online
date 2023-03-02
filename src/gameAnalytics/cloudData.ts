import { AppData } from "./AppData"

// rand 库
export function Rate(values, weights) {
    this.values = values
    this.weights = weights
    this.max = 0
    for (let i = 0, l = this.weights.length; i < l; ++i) {
        this.max += this.weights[i]
    }

    this.rndValue = function () {
        let valueMax = 0
        const value = Math.random() * this.max
        //console.log(value, this.max, this.weights.length, this.weights)
        for (let i = 0, l = this.weights.length; i < l; ++i) {
            valueMax += this.weights[i]
            if (valueMax >= value)
                return this.values[i]
        }
        return this.values[0]
    }
}

export const appsConfig = {
    "Battle Angels: PVP Defence": {
        cloud: {
            parameters: {},
            combines: { 'a.0': { data: { cloudHideGuideSkip: false }, weight: 1 } }
        }
    },
    "DustSettle": {
        cloud: {
            parameters: {
                enablePurchase: { id: "ep", enable: true, default: true },// 开启内购
                enablePropWeapon: { id: "ew", enable: true, default: true },// 开启武器
                interstitialLevel: { id: "il", enable: true, default: 3, test: [3, 6], weight: 1 },
                interstitialMinTime: { id: "it", enable: true, default: 15, test: [15, 20, 25, 30, 35, 40, 45], weight: 1 }, //插屏最少游戏时长/秒
                showInterstitial: { id: "si", enable: true, default: true },// 已废弃
                interstitialX: { id: "ix", enable: true, default: 1 },
                interstitialY: { id: "iy", enable: true, default: 0 },
                recommendPowerRate: { id: "rp", enable: true, default: 0.003 },//推荐战力系数
                difficultyRate: { id: "dr", enable: true, default: 0.75, test: [0.7, 0.72, 0.74, 0.76, 0.78, 0.8], weight: 1 },//难度系数
                boosLifeRate: { id: "bl", enable: true, default: 8, test: [7, 7.3, 7.6, 7.9, 8.2, 8.5], weight: 1 },//Boss的生命值系数
                enemyLifeRate: { id: "el", enable: false, default: 3 },//敌人的生命值系数（DPS*系数）
                enemyLifeMinRate: { id: "eln", enable: false, default: 2 },//敌人的生命值最小系数（DPS*系数）
                enemyLifeMaxRate: { id: "elx", enable: false, default: 12 }//敌人的生命值最大系数（DPS*系数）
            },
            combines: {
                'c.0': { data: {}, weight: 1 },
                'c.1': { data: { interstitialMinTime: 15, difficultyRate: 0.74, boosLifeRate: 7 }, weight: 4 },
                //'c.2': { data: { interstitialMinTime: 15, interstitialLevel: 5 }, weight: 1 },
            }
        }
    },
    "BulletBang": {
        cloud: {
            parameters: {},
            combines: { 'a.0': { data: { RewardAdLevelDur: 2 }, weight: 1 } }
        }
    },
    "MergeTowerShoot": {
        cloud: {
            parameters: {
                /*BossLifeRate: { id: "blr", enable: true, default: "1.0" },// XX
                RecycleUpgradeTimeDuration: { id: "rutd", enable: true, default: "900", },// XX
                MergeUpgradeTimeDuration: { id: "mutd", enable: true, default: "300", },// XX
                UpgradeChanceAccurate: { id: "uca", enable: true, default: "1.0", },// XX
                MergeUpgradeAccurate: { id: "mca", enable: true, default: "1.0", },// XX
                LevelBossLifeRate: { id: "lblr", enable: true, default: [{ "8": "1.5" }, { "18": "2" }], },// XX
                useInterstitialAd: { id: "utad", enable: true, default: 1, test: [1, 0], weight: 1 },// XX
                adTimes: { id: "adt", enable: true, default: 120, },// XX
                dynamicHP: { id: "dhp", enable: true, default: 1, test: [1, 0], weight: 1 }// XX*/
            },
            combines: {
                /*'c.0': { data: { useInterstitialAd: 1 }, weight: 0 },
                'c.1': { data: { useInterstitialAd: 0, dynamicHP: 1, dynamicHPValue: 3, dynamicHPStartLevel: 1, fixcoin: 5 }, weight: 0 },
                'd.0': { data: { useInterstitialAd: 1, adTimes: 10 }, weight: 1 },
                'd.1': { data: { useInterstitialAd: 1, adTimes: 10, dynamicHP: 1, dynamicHPValue: 3, dynamicHPStartLevel: 1, fixcoin: 5 }, weight: 1 },*/
                //'e.0': { data: { isRVCalADTime: 0, useAirGift: 0, AirGiftForceLevel: 99 }, weight: 1 },
                //'e.1': { data: { isRVCalADTime: 1, useAirGift: 0, AirGiftForceLevel: 99 }, weight: 1 },
                'e.a': { data: { adTimes: 300, useAirGift: 1, AirGiftForceLevel: 6 }, weight: 1 },
                'e.b': { data: { adTimes: 300, useAirGift: 0, AirGiftForceLevel: 999 }, weight: 1 },
            }
        }
    },
}