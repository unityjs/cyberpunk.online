import express, { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import jwt from "express-jwt"
import { HTTPException, ApiError } from './HTTPException'
import { getLang } from './polyglot'
import { logger } from "./log"
import { ResponseTest } from './test'

export function GetJwtMiddleware(secret: string, credentialsRequired: boolean = true): express.RequestHandler {
    const jwtMiddleware = jwt({
        secret,
        algorithms: ['HS256'],
        credentialsRequired,
        userProperty: "body.$payload",
        getToken: function (req) {
            if (req.headers.authorization?.split(' ')[0] === 'Bearer')
                return req.headers.authorization.split(' ')[1]
            return req.body?.token
        }
    })
    return jwtMiddleware
}

export function responseTime(responseTest: ResponseTest) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const responseTime = Date.now()
        const calResponseTime = function () {
            responseTest?.add(Date.now() - responseTime)
        }
        res.once('finish', calResponseTime);
        res.once('close', calResponseTime);
        return next();
    }
}

/*export function apiControllers(path: string, router: express.Router, controllers: { [name: string]: (query: any, id: string) => Promise<any> }, ...handlers: Array<RequestHandler<any>>) {
    for (const key in controllers) {
        router.all(path + key, ...handlers, apiMiddleware(controllers[key], async query => { query.appData = await AppData.getApp(appName) }))
    }
}*/
/*
if (checkMD5 && req.query.sign) {
    let content = "" + req.query.time + appName
    let result = crypto.createHash('md5').update(content).digest("hex")
    if (result != req.query.sign) {
        res.json({ success: false, data: "Invalid sign!" })
        return
    }
}*/
export function apiMiddleware(controller: (query: any, id?: string) => Promise<any>, handler?: (query: any) => Promise<void>, version?: number) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const query = req.body
        try {
            query._req = req
            query._id = req.body.$payload?._id
            if (handler) await handler(query)
            const data = await controller(query)
            if (version > 0) res.json(data ?? { success: true })
            else res.json(data != null ? { success: true, data } : { success: true })
        } catch (e: any) {
            if (e.message) {
                if (e.args) e.message = getLang(e.message, query.l, ...e.args)
                else e.message = getLang(e.message, query.l)
            }
            next(e)
        }
    }
}

export const errorMiddleware = (err: ApiError, req: Request, res: Response, _next: NextFunction) => {
    //next(new HTTPException(500, (e.data && e.data.error && e.data.error.message) || e.message))
    res.status(err.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.message,
        errors: err.errors
    })
}

export const emptyMiddleware = (req: Request, _res: Response, next: NextFunction) => { next(new HTTPException(404, getLang('未分配路由', req.body.l))) }
