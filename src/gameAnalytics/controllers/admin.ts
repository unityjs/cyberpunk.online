import { AppData } from "../AppData"
import { App } from "../models/App"

function checkNumber(value: any): number {
    value = parseInt(value)
    if (value <= Number.MAX_VALUE && value >= -Number.MAX_VALUE) return value
    return null
}

export async function logout() {
    //req.session.username = null
    //res.redirect('login')
}

var _excludedDBname = ["admin", "test", "local", "config"]
export async function appList(query: { start: number, count: number, search: string }) {
    query.start = checkNumber(query.start) ?? 0
    query.count = checkNumber(query.count) ?? 50
    const { start, count, search } = query

    const list = []
    //const adminDb = mongoose.db('test').admin()
    /*const adminDb = mongoose.connection.db.admin()
    const data = await adminDb.listDatabases()
    if (data) {
        var index = 0
        for (var db of data.databases) {
            var projectName = unescape(db.name)
            if (_excludedDBname.indexOf(projectName) !== -1) continue
            //if (req.session.username != "logame") continue
            if (search && search.length > 0 && projectName.indexOf(search) === -1) continue
            index++
            if (start >= index) continue
            if (index - start > count) break
            var appData = getAppData(projectName)
            list.push({ name: projectName, sizeOnDisk: db.sizeOnDisk, userCount: appData.db.userCount, icon: "static/icon/" + db.name + ".jpg" })
        }
    }*/
    /*for (let index in mongoose.connection.collections) {
        const coll = mongoose.connection.collections[index]
        let projectName = coll.name
    }*/
    const appList = (await App.find({})).slice(start, start + count)
    for (const app of appList) {
        const name = unescape(app.name)
        var appData = await AppData.getAppByName(name)
        const sizeOnDisk = await appData.dbSize()
        if (app.userCount > 5)
            list.push({ name, sizeOnDisk, userCount: app.userCount, icon: "static/icon/" + app.name + ".jpg" })
    }

    return list
}