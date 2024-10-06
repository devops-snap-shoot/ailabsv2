import { model, Schema, Document } from 'mongoose'
const fileJobsSchema = new Schema(
    {
        name: {
            type: Schema.Types.String
        },
        tokenToServer: {
            type: String,
            required: true
        },
        urlFile: {
            type: Schema.Types.String
        },
        token: {
            type: Schema.Types.String
        },
        idFile: {
            type: Schema.Types.Number
        },
        state: {
            type: Schema.Types.Boolean
        },
        ocr: {
            type: Schema.Types.Boolean
        }
    },
    {
        timestamps: true,
        id: false
    }
)

fileJobsSchema.index({ name: 1 }, { unique: true })
const fileJobsModel = model<Document>('FilesJob', fileJobsSchema)

export default fileJobsModel