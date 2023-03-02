import mongoose, { Schema, Model, Document } from 'mongoose'

export interface IReport extends Document {
    date: Date,
    source: string,
    condition: string,
    stackTrace: string,
    expand: string,
    version: string,
    count: number,
}

const ReportSchema = new Schema<IReport>({
    date: Date,
    source: String,
    condition: String,
    stackTrace: String,
    expand: String,
    version: String,
    count: Number,
}, {
    timestamps: true,
});

/** 上报日志表 */
export interface ReportModel extends Model<IReport> {
    add: (source: string, condition: string, stackTrace: string, expand: string, version: string) => Promise<void>
}

ReportSchema.static('add', async function (this: ReportModel, source: string, condition: string, stackTrace: string, expand: string, version: string): Promise<void> {
    await this.updateOne({ source, version, condition, stackTrace, expand }, { $inc: { count: 1 } }, { upsert: true })
})

export default (appId: string) => mongoose.model<IReport, ReportModel>('Report_' + appId, ReportSchema)