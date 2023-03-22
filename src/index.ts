import { createLogger } from "./utils/log"
const logger = createLogger("api");

import express from "express"
import WebSocket from 'ws'
import vhost from 'vhost'
import path from 'path'
import { RelayServer } from "./wsss/relayServer"
import { remoteMultRelay, remoteRelay } from "./wsss/remoteRelay"
import { createExpress, createServer, createRedirectHttpsServer, GetProxyRouter } from "./utils/express"
import { GetAdminRouter, GetApiRouter, GetApiRouterForGa } from "./gameAnalytics"
import { connectDatabase } from "./utils/database"
import { JWT_SECRET, MONGO_URI } from "./env";
import  {  Server } from "http"
import { chatgptRouter } from "./chatgptApi"


async function initGameAnalytics(app: express.Express) {
  //await connectDatabase(MONGO_URI)
  const adminRouter = await GetAdminRouter(JWT_SECRET)
  const apiRouter = await GetApiRouter()
  app.use(vhost('ga.unityjs.net', adminRouter))
  // API
  app.use('/g', vhost('api.unityjs.net', await GetApiRouterForGa()))
  app.use('/api/g', apiRouter)
  app.use('/api/admin', adminRouter)
}


 function initRelayServer(server: Server) {
  const wss = new WebSocket.Server({ server })

  new RelayServer({
    server: wss,
    serverName: 'wsss',
    logLevel: 'warn',
    callback: async (client) => {
      //await remoteRelay(client, 'wasduijk', 'aes-256-cfb')
      await remoteMultRelay(client, 'wasduijk', 'aes-256-cfb')
    }
  })
}

async function main() {
  const app = createExpress()
  app.use(express.static(path.join(process.cwd(), 'public/www')))
  app.use(vhost('www.cyberpunk.online', express.static(path.join(process.cwd(), 'public/cyberpunk.online'))))
  app.use(vhost('www.soulgame.cn', express.static(path.join(process.cwd(), 'public/soulgame.cn'))))
  app.use(vhost('ga.unityjs.net', express.static(path.join(process.cwd(), 'public/ga'))))
  app.use(vhost('localhost', express.static(path.join(process.cwd(), 'public/cyberpunk.online'))))
  app.use("/api/chat", chatgptRouter)
  //initGameAnalytics(app)
  // url代理功能
  app.use('/http/*', GetProxyRouter())
  app.use('/https/*', GetProxyRouter())
  //app.use('/heroku/*', GetProxyRouter(url => "https://api.unityjs.net" + url.substr(7)));

  var useHttps = false
  if(useHttps){
    const httpsServer = createServer(app, true)
    httpsServer.listen(443, function () { console.log(`Running on ${443}`) })
    const server = createRedirectHttpsServer()
    //initRelayServer(server)
  }else{
    const server = createServer(app)
    const port = process.env.PORT || 5002
    server.listen(port, function () { console.log(`Running on ${port}`) })
    //initRelayServer(server)
  }
}

main()