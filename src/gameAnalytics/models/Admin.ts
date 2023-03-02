import mongoose, { Schema, Model, Document } from 'mongoose'
//import { MONGO_URI } from "../../env"
//const db = mongoose.createConnection(MONGO_URI, { dbName: "analytics", useFindAndModify: false, autoIndex: false, useNewUrlParser: true, useUnifiedTopology: true })

export interface IAdmin extends Document {
    username: string
    password: string
    role:string
    nickname:string
    avatar:string
}

const AdminSchema = new Schema<IAdmin>({
    // username: { type: String, required: [true, '用户名不为空'], minlength: [6, '最小长度不能小于6位'], maxlength: [12, '最大长度不得大于12位'] },
    username: { type: String, index: { unique: true, sparse: true } },
    password: String,
    role:String,
    nickname:String,
    avatar:String
})

export const Admin = mongoose.model<IAdmin, Model<IAdmin>>('Admin', AdminSchema)