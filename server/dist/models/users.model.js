"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
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
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Role'
        }
    ],
    organization: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Organization'
        }
    ],
    speciality: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Specialty'
        }
    ],
    userOtherData: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'UserOtherData'
    }
}, {
    timestamps: true,
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
});
const userModel = (0, mongoose_1.model)('User', userSchema);
exports.default = userModel;
//# sourceMappingURL=users.model.js.map