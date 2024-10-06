"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const users_controller_1 = (0, tslib_1.__importDefault)(require("@controllers/users.controller"));
const auth_middleware_1 = (0, tslib_1.__importDefault)(require("@/middlewares/auth.middleware"));
const router = (0, express_1.Router)();
router.post(`/createUser`, /* authMiddleware, */ users_controller_1.default.createUser);
router.post(`/editUser`, /* authMiddleware, */ users_controller_1.default.editUser);
router.get(`/getUsersByCompany/:companyId`, /* authMiddleware, */ users_controller_1.default.getUsersByCompany);
router.post(`/getUserById`, auth_middleware_1.default, users_controller_1.default.getUserById);
router.get(`/deleteUser/:id`, auth_middleware_1.default, users_controller_1.default.deleteUser);
router.get(`/getUsers`, /* authMiddleware, */ users_controller_1.default.getUsers);
exports.default = router;
//# sourceMappingURL=users.route.js.map