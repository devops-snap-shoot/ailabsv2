"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const fileSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User'
    },
    idFile: {
        type: Number
    },
    ocr: {
        type: mongoose_1.Schema.Types.Boolean,
        default: false
    },
    state: {
        type: mongoose_1.Schema.Types.Boolean
    }
}, {
    timestamps: true,
    id: false
});
fileSchema.index({ name: 1, organizationId: 1 }, { unique: true });
const fileModel = (0, mongoose_1.model)('File', fileSchema);
exports.default = fileModel;
//# sourceMappingURL=files.model.js.map