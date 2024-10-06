import { model, Schema, Document } from 'mongoose'
import { User } from '@interfaces/users.interface'

const userSchema: Schema = new Schema(
    {
        user_id: {
            type: Number
        },
        name: {
            type: String,
            required: [true, 'Name is required']
        },
        lastName: {
            type: String
        },
        secondLastName: {
            type: String,
            required: false
        },
        run: {
            type: String,
            required: false
        },
        phone: {
            type: String
        },
        address: {
            type: String
        },
        region: {
            type: String
        },
        city: {
            type: String
        },
        nacionality: {
            type: String
        },
        birthdate: {
            type: String
        },
        gender: {
            type: String
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true
        },
        password: {
            type: String,
            required: false
        },
        passwordProvisory: {
            type: String,
            required: false
        },
        emailVerifiedAt: {
            type: Date,
            default: null,
            required: false
        },
        state: {
            type: Boolean,
            default: true
        },
        image: {
            type: String,
            required: false
        },
        profileImage: {
            type: String,
            required: false
        },
        totalDocsByMonth: {
            type: Number
        },
        payment_status: {
            type: String
        },
        roles: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Role'
            }
        ],
        organization: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Organization'
            }
        ],
        speciality: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Specialty'
            }
        ],
        userOtherData: {
            type: Schema.Types.ObjectId,
            ref: 'UserOtherData'
        }
    },
    {
        timestamps: true,
        toObject: {
            virtuals: true
        },
        toJSON: {
            virtuals: true
        }
    }
)

const userModel = model<User & Document>('User', userSchema)

export default userModel
