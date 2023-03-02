import crypto from "crypto"
import jwt from "jsonwebtoken"
import { get } from "httpie"

export function hashPassword(password: string) {
    // creating a unique salt for a particular user
    const salt = crypto.randomBytes(16).toString('hex')
    // hashing user's salt and password with 1000 iterations, 32 length and sha512 digest
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 32, `sha512`).toString(`hex`)
    return { salt, hash }
}

/*export function isValidPassword(user: IUser, password) {
    const hash = crypto.pbkdf2Sync(password, user.passwordSalt, 1000, 32, `sha512`).toString(`hex`)
    return user.password === hash
}*/
export function passwordHash(password, passwordSalt) {
    const hash = crypto.pbkdf2Sync(password, passwordSalt, 1000, 32, `sha512`).toString(`hex`)
    return hash
}

export async function getFacebookUser(accessToken: string) {
    const fields = 'id,name,short_name,friends,email,picture'
    const req = await get(`https://graph.facebook.com/me?fields=${fields}&access_token=${accessToken}`, {
        headers: { 'Accept': 'application/json' }
    })
    // TODO: paginate through user friends
    return req.data
}

export function verifyToken(token: string, secret: string) {
    return jwt.verify(token, secret)
}