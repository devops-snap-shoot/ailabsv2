import { Organization } from '@/interfaces/roles.interface'
import { model, Schema, Document } from 'mongoose'

const organizationSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: false
        },
        subdomain: {
            type: String
        },
        state: {
            type: Boolean,
            default: true
        },
        logo:{
                type: String
        },
        isotype:{
                type: String
        },
        theme:{
                type: String
        },
        idorg: {
            type: Number
        },
        language: {
            type: String
        }
    },
    {
        timestamps: true,
        id: false
    }
)

const organizationModel = model<Organization & Document>('Organization', organizationSchema)

export default organizationModel