import { AppData } from "../AppData"

export async function adShow(query: { appData: AppData, channel: string, version: string, cloud: string }) {
    const { appData, channel, version, cloud } = query
    appData.event(channel, version, cloud, "myAdShow", 1)
}

export async function adClick(query: { appData: AppData, success: any, channel: string, version: string, cloud: string }) {
    const { appData, channel, version, cloud, success } = query
    appData.event(channel, version, cloud, "myAdClick", parseFloat(success))
}

export async function ad(query: { appData: AppData, event: string, value: any, channel: string, version: string, cloud: string }) {
    const { appData, channel, version, cloud, event, value } = query
    appData.event(channel, version, cloud, "myAd" + event, parseFloat(value))
}