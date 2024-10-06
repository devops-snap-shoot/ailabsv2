"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const messagesSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User'
    },
    avatar: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Avatar'
    },
    role: {
        type: mongoose_1.Schema.Types.String
    },
    content: {
        type: mongoose_1.Schema.Types.String
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
    audios: [
        {
            type: String
        }
    ],
    cache: {
        type: Object
    }
}, {
    timestamps: true,
    id: false
});
const messagesModel = (0, mongoose_1.model)('Messages', messagesSchema);
exports.default = messagesModel;
//# sourceMappingURL=messages.model.js.map