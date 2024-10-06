/* import { File } from '@/interfaces/file.interface' */
import { model, Schema, Document } from 'mongoose'
const chatsSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        token: {
            type: String
        },
        timeLimit: {
            type: Date
        },
        messages: [
            {
                type: Object
            }
        ],
        state: {
            type: Boolean
        }
    },
    {
        timestamps: true,
        id: false
    }
)

/* chatsSchema.index({ name: 1, organizationId: 1 }, { unique: true }) */
const chatsModel = model<{
    user: any,
    token: string,
    timeLimit: Date,
    messages: any[]
    createdAt: Date,
    updatedAt: Date,
    state: boolean
} & Document>('Chat', chatsSchema)

export default chatsModel