"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userOtherDataSchema = new mongoose_1.Schema({
    institutions: [
        {
            type: String
        }
    ],
    sector: {
        type: String
    },
    graduationUniversity: {
        type: String
    },
    tastes: {
        montain: {
            type: Boolean
        },
        sea: {
            type: Boolean
        },
        hobbie: {
            type: String
        },
        collectibles: [
            {
                type: String
            }
        ],
        politicalTrend: {
            type: String
        },
        personalAppearance: {
            type: String
        },
        physicalBuild: {
            type: String
        },
        pet: {
            type: String
        },
        maritalStatus: {
            type: String
        },
        foods: {
            type: String
        },
        music: {
            type: String
        },
        socialStratum: {
            type: String
        },
        socialProfile: {
            type: String
        }
    },
    workData: {
        telemedicine: {
            type: Boolean
        },
        healthForecast: {
            type: Object
        },
        kardex: {
            type: String
        }
    },
    state: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    id: false
});
const userOtherDataModel = (0, mongoose_1.model)('UserOtherData', userOtherDataSchema);
exports.default = userOtherDataModel;
//# sourceMappingURL=userOtherData.model.js.map