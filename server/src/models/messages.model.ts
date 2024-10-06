import { model, Schema, Document } from 'mongoose'
const messagesSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        avatar: {
            type: Schema.Types.ObjectId,
            ref: 'Avatar'
        },
        role: {
            type: Schema.Types.String
        },
        content: {
            type: Schema.Types.String
        },
        isAvatarHistory: {
            type: Boolean,
            default: false
        },
        state: {
            type: Boolean,
            default: true
        },
        deleted: {
            type: Boolean,
            default: false
        },
        urlAudio: {
            type: String
        },
        audios:[
            {
                type: String
            }
        ],
        cache: {
            type: Object
        }
    },
    {
        timestamps: true,
        id: false
    }
)

const messagesModel = model<Document>('Messages', messagesSchema)

export default messagesModel