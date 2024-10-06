"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const specialitySchema = new mongoose_1.Schema({
    name: {
        type: String
    },
    description: {
        type: Number
    },
    organization: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Organization'
    },
    specialityMather: {
        type: String
    },
    state: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    id: false
});
const specialityModel = (0, mongoose_1.model)('Specialty', specialitySchema);
exports.default = specialityModel;
//# sourceMappingURL=specialty.model.js.map