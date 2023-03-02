//import libqqwry from "lib-qqwry"
import IPDBv6 from "./IPDBv6"
import node_ip2region from "node-ip2region"

const searcher = node_ip2region.create()
//const qqwry = libqqwry()
//qqwry.speed() //启用急速模式
///const ipdbv6 = new IPDBv6()

export function getRegion(ip: string): string {
    try {
        // IPv4
        let m = ip.match(/\d+\.\d+\.\d+\.\d+/)
        if (m) {
            const ret = searcher.btreeSearchSync(m[0])
            if (ret) return ret.region.split('|')[0]
            else throw new Error("IPv4 null")
        }

        // IPv6
        m = ip.match(/^([\da-fA-F]{0,4}:){2,7}[\da-fA-F]{0,4}/)
        if (m) {
            const ret = ipdbv6.getIPAddr(m[0])
            if (ret) return ret.region
            else throw new Error("IPv6 null")
        }

        // Bad IP
        throw new Error("Bad IP")
    } catch (error) {
        console.error(`getRegion err: ${ip} ${error}`)
    }
    return "unknown"
}