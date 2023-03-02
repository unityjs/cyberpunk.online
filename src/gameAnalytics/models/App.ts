
import mongoose, { Schema, Model, Document } from 'mongoose'

export interface ConfigKey {
    name: string
    sort: number
    enable: boolean
}
const ConfigKeySchema = new Schema<ConfigKey>({
    name: String,
    sort: Number,
    enable: Boolean
}, { _id: false })

export interface RankItem {
    id: string
    name: string
    score: number
    expand: any
    time: number
}
const RankItemSchema = new Schema<RankItem>({
    id: String,
    name: String,
    score: Number,
    expand: Schema.Types.Mixed,
    time: Number
}, { _id: false })

export interface Rank {
    top: RankItem[]
    total: number
    counter: number[]
}
const RankSchema = new Schema<Rank>({
    top: [RankItemSchema],
    total: Number,
    counter: [Number]
}, { _id: false })

/*export interface ConfigKeys {
    channel: ConfigKey[]
    version: ConfigKey[]
    cloud: ConfigKey[]
    event: ConfigKey[]
    missionEvent: ConfigKey[]
    region: ConfigKey[]
}*/
/*const ConfigKeysSchema = new Schema<ConfigKeys>({
    channel: [ConfigKeySchema],
    version: [ConfigKeySchema],
    cloud: [ConfigKeySchema],
    event: [ConfigKeySchema],
    missionEvent: [ConfigKeySchema],
    region: [ConfigKeySchema]
}, { _id: false })*/

export interface AppConfig {
    cloud: {
        parameters: { [name: string]: { id: string, enable: boolean, default: boolean, test?: any[], weight?: number } },
        combines: any
    }
}

export interface IApp extends Document {
    name: string
    id: string
    userCount: number
    ranks: Map<string, Rank>
    configKeys: any //Map<string, Map<string, ConfigKey>>
    config: AppConfig
}
const AppSchema = new Schema<IApp>({
    name: String,
    id: String,
    userCount: Number,
    ranks: { type: Map, of: RankSchema },
    //configKeys: { type: Map, of: { type: Map, of: ConfigKeySchema } }
    configKeys: { type: Schema.Types.Mixed },
    config: { type: Schema.Types.Mixed },
})

/*AppSchema.pre('save', async function (next) {
    if (this.isNew)
        this.id = await Counter.getNextSequenceValue('App')
    next();
});*/


export const App = mongoose.model<IApp, Model<IApp>>('App', AppSchema)