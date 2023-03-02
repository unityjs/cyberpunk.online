import { logger } from "./log"
import { MongoError } from "mongodb"
import mongoose from 'mongoose'

export async function connectDatabase(uri: string, cb?: (err: MongoError) => void) {
    // skip if already connecting or connected.
    if (mongoose.connection.readyState !== 0) {
        if (cb) cb(null)
        return
    }

    try {
        logger.info(`Connecting to ${uri}`)
        await mongoose.connect(uri, { useFindAndModify: false, autoIndex: false, useNewUrlParser: true, useUnifiedTopology: true }, cb)
        logger.info(`Successfully connected to ${uri}`)

        // reconnect if disconnected.
        mongoose.connection.on('disconnected', () => connectDatabase(uri))
    } catch (e) {
        logger.error('Error connecting to database', e)
    }
}