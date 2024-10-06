"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const avatarSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    fullName: {
        type: String
    },
    users: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    idAvatar: {
        type: String
    },
    state: {
        type: mongoose_1.Schema.Types.Boolean
    },
    voice: {
        type: String
    },
    urlImage: {
        type: String
    },
    doc: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'File'
    }
}, {
    timestamps: true,
    id: false
});
const avatarModel = (0, mongoose_1.model)('Avatar', avatarSchema);
exports.default = avatarModel;
//# sourceMappingURL=avatares.model.js.map