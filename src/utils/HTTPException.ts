export class HTTPException {
    constructor(public status: number, public message: string, public errors?: any) {
        this.status = status
        this.message = message
        this.errors = errors || {}
    }
}

class BaseError extends Error {
    constructor(message: string) {
        super(message)
        this.name = new.target.name
        if (typeof (Error as any).captureStackTrace === 'function') {
            (Error as any).captureStackTrace(this, new.target)
        }
        if (typeof Object.setPrototypeOf === 'function') {
            Object.setPrototypeOf(this, new.target.prototype)
        } else {
            (this as any).__proto__ = new.target.prototype
        }
    }
}

export class ApiError extends BaseError {
    args: any[]
    status: number
    errors: any
    constructor(message: string, ...args: any[]) {
        super(message)
        this.args = args
    }
}