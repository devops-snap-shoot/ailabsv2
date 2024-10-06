import { model, Schema, Document } from 'mongoose'

const specialitySchema = new Schema(
    {
        name: {
            type: String
        },
        description: {
            type: Number
        },
        organization: {
            type: Schema.Types.ObjectId,
            ref: 'Organization'
        },
        specialityMather: {
            type: String
        },
        state: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
        id: false
    }
)

const specialityModel = model<Document>('Specialty', specialitySchema)

export default specialityModel