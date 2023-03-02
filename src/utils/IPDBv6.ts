import fs from 'fs'

const DEFAULT_DB_PATH = './data/ipv6wry-country.db'

export default class IPDBv6 {
    dbname: string
    buffer: Buffer
    view: DataView
    max: number
    firstIndex: number
    indexCount: number
    offlen: number
    iplen: number
    constructor(path: string = DEFAULT_DB_PATH) {
        this.dbname = path

        //this.totalInMemoryBytesSize = fs.statSync(dbname).size
        //this.totalInMemoryBytes = null
        this.buffer = fs.readFileSync(path)
        this.view = new DataView(this.buffer.buffer)
        this.max = this.buffer.length

        if (this.getLong8(4, 2) > 1) throw "数据库格式错误"
        this.firstIndex = this.getLong8(16)
        this.indexCount = this.getLong8(8)
        this.offlen = this.getLong8(6, 1)
        this.iplen = this.getLong8(7, 1)
        //console.log(this.firstIndex, this.indexCount, this.offlen, this.iplen)
    }

    getLong8(start, length = 8) {
        start = start || 0
        length = length < 1 ? 1 : length > 6 ? 6 : length
        return this.buffer.readUIntLE(start, length)
    }

    getBigInt(offset) {
        return this.view.getBigUint64(offset, true)
    }

    getString(start) {
        var B = start || 0
        var E = B
        for (; E < this.max; ++E) {
            if (this.buffer[E] === 0) break
        }
        return this.buffer.toString('utf8', B, E)
    }

    getAreaAddr(offset) {
        var byte = this.buffer[offset]
        if (byte == 1 || byte == 2) {
            return this.getAreaAddr(this.getLong8(offset + 1, this.offlen))
        }
        return this.getString(offset)
    }

    getAddr(offset, ip = 0) {
        var byte = this.buffer[offset]
        if (byte == 1) {
            return this.getAddr(this.getLong8(offset + 1, this.offlen))
        }
        let region = this.getAreaAddr(offset)
        if (byte == 1) offset += 1 + this.offlen
        else for (; offset < this.max; offset++) {
            if (this.buffer[offset] === 0) {
                offset++
                break
            }
        }
        let area = this.getAreaAddr(offset)
        //console.log(region, area)
        return { region, area }
    }

    find(ip, l, r) {
        if (r - l <= 1)
            return l
        let m = (l + r) >> 1
        let o = this.firstIndex + m * (8 + this.offlen)
        let new_ip = this.getBigInt(o)
        //console.log(ip, l, r, new_ip)
        if (ip < new_ip) return this.find(ip, l, m)
        else return this.find(ip, m, r)
    }

    getIPv6Int(ip) {
        let parts = ip.split(':')
        if (parts.length < 3 || parts.length > 8) throw "ip地址错误"
        if (parts.length < 8) {
            parts = ip.replace("::", ":::::::".substr(0, 8 - parts.length + 2)).split(':')
        }
        let ipInt = 0n
        for (let i = 0; i < 4; ++i) {
            ipInt <<= 16n
            ipInt |= BigInt("0x" + parts[i])
        }
        return ipInt
    }

    getIPAddr(ip) {
        //let ip6 = getIPv6Int(ip)
        //ip = (ip6 >> 64n) & 0xFFFFFFFFFFFFFFFFn
        let ipInt = this.getIPv6Int(ip)
        //console.log(ip, ipInt)
        //使用 find 函数查找ip的索引偏移
        let i = this.find(ipInt, 0, this.indexCount)
        //得到索引记录
        let ip_off = this.firstIndex + i * (8 + this.offlen)
        let ip_rec_off = this.getLong8(ip_off + 8, this.offlen)
        /*let { c, a } = this.getAddr(ip_rec_off)
        if (ip6 == 0x1n) c = "本机地址"
        else if (ip == 0n && ip6 >> 32n & 0xFFFFFFFFn == 0xFFFFn) {	// IPv4映射地址
            let realip = (ip6 & 0xFFFFFFFFn)
            let realipstr = inet_ntoa(realip)
        } else if (ip >> 48n & 0xFFFFn == 0x2002n) {	// 6to4
            let realip = (ip & 0x0000FFFFFFFF0000n) >> 16n
            let realipstr = inet_ntoa(realip)
        } else if (ip >> 32n & 0xFFFFFFFFn == 0x20010000n) {	// teredo
            let serverip = (ip & 0xFFFFFFFFn)
            let serveripstr = inet_ntoa(serverip)
            let realip = (~ip6 & 0xFFFFFFFFn)
            let realipstr = inet_ntoa(realip)
        } else if (ip6 >> 32n & 0xFFFFFFFFn == 0x5EFEn)// isatap
            realip = (ip6 & 0xFFFFFFFFn)
        realipstr = inet_ntoa(realip)*/
        return this.getAddr(ip_rec_off)
    }
}