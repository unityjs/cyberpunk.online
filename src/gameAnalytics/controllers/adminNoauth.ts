import { Admin } from "../models/Admin"
import { Request } from "express"
import { floatFixed2, getNowDay, floatFixed, getNowHours } from "../../utils/time"
import { AppData } from "../AppData"
import { JWT_SECRET } from '../../env'
import jwt from 'jsonwebtoken'
import { App } from "../models/App"
import { getClientIp } from "../../utils/express"
import { getRegion } from "../../utils/region"
import { ApiError } from "../../utils/HTTPException"

/** 注册 */
export async function register(query: { username: string, password: string }) {
    const { username, password } = query
    const admin = await Admin.findOne({ username })
    if (admin) throw new ApiError("账号已经存在")
    await Admin.insertMany({ username, password })
}

/** 登录，返回token */
export async function login(query: { username: string, password: string }) {
    const { username, password } = query
    if (username == null || username.length < 2 || password == null || password.length < 6)
        throw new ApiError("账号或密码错误(50)")
    const admin = await Admin.findOne({ username, password })
    if (!admin) throw new ApiError("账号或密码错误(51)")
    // 添加响应头
    //res.setHeader("Access-Control-Allow-Origin", "http://localhost:8080")
    //res.setHeader("Access-Control-Allow-Credentials", true)
    //req.session.username = query.username // 登录成功，设置 session

    const { role, nickname, avatar } = admin
    const token = jwt.sign({ _id: admin._id }, JWT_SECRET)
    return { token, role, nickname, avatar }
}

/** 获取IP */
export async function getip(query: { ip: string, _req: Request }) {
    let { ip } = query
    ip ||= getClientIp(query._req)
    const begin = Date.now()
    const region = getRegion(ip)
    const time = Date.now() - begin
    return { ip, time, region }
}
