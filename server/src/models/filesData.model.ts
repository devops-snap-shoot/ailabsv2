/* import { File } from '@/interfaces/file.interface' */
import { model, Schema, Document, ObjectId } from 'mongoose'
const filesDataSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        userId: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        id: {
            type: Number
        },
        messages: [
            {
                type: Object
            }
        ],
        organization: {
            type: Schema.Types.ObjectId,
            ref: 'Organization'
        },
        chats: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Chat'
            }
        ],
        url: {
            type: String
        },
        wait: {
            type: Boolean
        },
        state: {
            type: Boolean
        },
        ocr: {
            type: Schema.Types.Boolean,
            default: false
        },
    },
    {
        timestamps: true,
        id: false
    }
)

/* filesDataSchema.index({ name: 1, organizationId: 1 }, { unique: true }) */
const filesDataModel = model<{
    name: string,
    userId: ObjectId,
    id: number,
    messages: any[],
    chats: any[],
    url: string,
    createdAt: Date,
    updatedAt: Date,
    state: boolean
} & Document>('File', filesDataSchema)

export default filesDataModel