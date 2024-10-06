"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const organizationSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        unique: false
    },
    subdomain: {
        type: String
    },
    state: {
        type: Boolean,
        default: true
    },
    logo: {
        type: String
    },
    isotype: {
        type: String
    },
    theme: {
        type: String
    },
    idorg: {
        type: Number
    },
    language: {
        type: String
    }
}, {
    timestamps: true,
    id: false
});
const organizationModel = (0, mongoose_1.model)('Organization', organizationSchema);
exports.default = organizationModel;
//# sourceMappingURL=organization.model.js.map