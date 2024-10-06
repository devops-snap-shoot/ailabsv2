"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const fileJobsSchema = new mongoose_1.Schema({
    name: {
        type: mongoose_1.Schema.Types.String
    },
    tokenToServer: {
        type: String,
        required: true
    },
    urlFile: {
        type: mongoose_1.Schema.Types.String
    },
    token: {
        type: mongoose_1.Schema.Types.String
    },
    idFile: {
        type: mongoose_1.Schema.Types.Number
    },
    state: {
        type: mongoose_1.Schema.Types.Boolean
    },
    ocr: {
        type: mongoose_1.Schema.Types.Boolean
    }
}, {
    timestamps: true,
    id: false
});
fileJobsSchema.index({ name: 1 }, { unique: true });
const fileJobsModel = (0, mongoose_1.model)('FilesJob', fileJobsSchema);
exports.default = fileJobsModel;
//# sourceMappingURL=filesJobs.model.js.map