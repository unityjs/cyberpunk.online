import express, { Request, Response, NextFunction } from "express"
import { AppData } from "./AppData"
import * as  adminControllers from './controllers/admin'
import * as  adminAppControllers from './controllers/adminApp'
import * as  adminNoauthControllers from './controllers/adminNoauth'
import * as  apiControllers from './controllers'
import { apiMiddleware, emptyMiddleware, errorMiddleware, GetJwtMiddleware } from "../utils/middlewares"
import { App } from "./models/App"
import { ApiError } from "../utils/HTTPException"
import { logger } from "../utils/log"

export const adminAppDataMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.appName) {
        req.body.appName = unescape(req.body.appName)
        req.body.appData = await AppData.getAppByName(req.body.appName)
    } else {
        const appName = (await App.findOne()).name
        console.log('appName findOne', appName)
        req.body.appName = appName
        req.body.appData = await AppData.getAppByName(appName)
    }
    next()
}

export const appDataMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    req.body.appName ||= 'unknown'
    req.body.appName = unescape(req.body.appName)
    req.body.appData = await AppData.getAppByName(req.body.appName)
    next()
}

const reportApiLog = async (e: Error, req: Request, res: Response, next: NextFunction) => {
    const { v: version } = req.body
    const condition = `'${req.path}' ` + e.message
    const stackTrace = e instanceof ApiError ? '' : e.stack
    delete req.body.appData
    delete req.body._req
    //logger.error(e.message)
    if (e instanceof ApiError) logger.error(`'${req.path}' ${JSON.stringify(req.body)} ` + e.message)
    else logger.error(`'${req.path}' ${JSON.stringify(req.body)}`, e)
    //await Report.addLog('api', condition, stackTrace, null, version)
    next(e)
}

export function GetAdminRouter(secret: string): express.Router {
    const router = express.Router()
    const jwtMiddleware = GetJwtMiddleware(secret)
    const jwtMiddlewareNoauth = GetJwtMiddleware(secret, false)
    for (const key in adminControllers) router.all('/' + key, jwtMiddleware, apiMiddleware(adminControllers[key], null, 1))
    for (const key in adminNoauthControllers) router.all('/' + key, jwtMiddlewareNoauth, apiMiddleware(adminNoauthControllers[key], null, 1))
    for (const key in adminAppControllers) router.all('/' + key, adminAppDataMiddleware, jwtMiddleware, apiMiddleware(adminAppControllers[key], null, 1))
    router.use(emptyMiddleware, reportApiLog, errorMiddleware)
    return router
}

export function GetApiRouterForGa(): express.Router {
    const router = express.Router()
    // 修正v1版本
    router.use((req: Request, _res: Response, next: NextFunction) => {
        if (req.body.data) Object.assign(req.body, JSON.parse(req.body.data))
        next()
    })
    for (const key in apiControllers) router.all('/' + key, appDataMiddleware, apiMiddleware(apiControllers[key], null, 0))
    router.use(emptyMiddleware, reportApiLog, errorMiddleware)
    return router
}

export function GetApiRouter(): express.Router {
    const router = express.Router()
    for (const key in apiControllers) router.all('/' + key, appDataMiddleware, apiMiddleware(apiControllers[key], null, 1))
    router.use(emptyMiddleware, reportApiLog, errorMiddleware)
    return router
}