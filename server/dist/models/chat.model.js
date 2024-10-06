"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* import { File } from '@/interfaces/file.interface' */
const mongoose_1 = require("mongoose");
const chatsSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, {
    timestamps: true,
    id: false
});
/* chatsSchema.index({ name: 1, organizationId: 1 }, { unique: true }) */
const chatsModel = (0, mongoose_1.model)('Chat', chatsSchema);
exports.default = chatsModel;
//# sourceMappingURL=chat.model.js.map