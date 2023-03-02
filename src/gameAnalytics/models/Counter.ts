
import mongoose, { Schema, Model, Document } from 'mongoose'

export interface ICounter extends Document {
    seq: number,
}

const CounterSchema = new Schema<ICounter>({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
})

interface CounterModel extends Model<ICounter> {
    getNextSequenceValue: (sequenceName: string) => Promise<number>
}

CounterSchema.static('getNextSequenceValue', async function (this: CounterModel, sequenceName: string): Promise<number> {
    var counter = await this.findOneAndUpdate(
        { _id: sequenceName },
        { $inc: { seq: 1 } }, {
        new: true,
        upsert: true
    })
    return counter.seq
})

export default mongoose.model<ICounter, CounterModel>('Counter', CounterSchema)