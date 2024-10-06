"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const organizationUsersSchema = new mongoose_1.Schema({
    organization: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Organization'
    },
    users: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
}, {
    timestamps: true,
    id: false
});
const organizationUsersModel = (0, mongoose_1.model)('OrganizationUsers', organizationUsersSchema);
exports.default = organizationUsersModel;
//# sourceMappingURL=organization-users.model.js.map