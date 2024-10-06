import { model, Schema, Document } from 'mongoose'
const avatarSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        fullName: {
            type: String
        },
        users: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        idAvatar: {
            type: String
        },
        state: {
            type: Schema.Types.Boolean
        },
        voice: {
            type: String
        },
        urlImage: {
            type: String
        },
        doc: {
            type: Schema.Types.ObjectId,
            ref: 'File'
        }
    },
    {
        timestamps: true,
        id: false
    }
)

const avatarModel = model<Document>('Avatar', avatarSchema)

export default avatarModel