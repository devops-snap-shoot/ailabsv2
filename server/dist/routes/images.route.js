"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const azure_storage_service_1 = (0, tslib_1.__importDefault)(require("@/services/azure-storage.service"));
const router = (0, express_1.Router)();
router.post(`/upload_image`, azure_storage_service_1.default.uploadImage);
exports.default = router;
//# sourceMappingURL=images.route.js.map