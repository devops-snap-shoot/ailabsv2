"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* import { File } from '@/interfaces/file.interface' */
const mongoose_1 = require("mongoose");
const filesDataSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    userId: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Organization'
    },
    chats: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
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
        type: mongoose_1.Schema.Types.Boolean,
        default: false
    },
}, {
    timestamps: true,
    id: false
});
/* filesDataSchema.index({ name: 1, organizationId: 1 }, { unique: true }) */
const filesDataModel = (0, mongoose_1.model)('File', filesDataSchema);
exports.default = filesDataModel;
//# sourceMappingURL=filesData.model.js.map