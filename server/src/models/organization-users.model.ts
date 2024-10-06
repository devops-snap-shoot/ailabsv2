import { OrganizationUsers } from '@/interfaces/roles.interface'
import { model, Schema, Document } from 'mongoose'

const organizationUsersSchema = new Schema(
    {
        organization: {
            type: Schema.Types.ObjectId,
            ref: 'Organization'
        },
        users: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ]
    },
    {
        timestamps: true,
        id: false
    }
)

const organizationUsersModel = model<OrganizationUsers & Document>('OrganizationUsers', organizationUsersSchema)

export default organizationUsersModel