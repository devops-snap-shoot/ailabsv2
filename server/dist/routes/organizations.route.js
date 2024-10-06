"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const auth_middleware_1 = (0, tslib_1.__importDefault)(require("@/middlewares/auth.middleware"));
const permission_middleware_1 = require("@/middlewares/permission.middleware");
const organizations_controller_1 = (0, tslib_1.__importDefault)(require("@/controllers/organizations.controller"));
const router = (0, express_1.Router)();
router.post(`/createOrg`, 
/* authMiddleware,
grantAccess('createAny', 'OrganizationPermission'), */
/* validationMiddleware(CreateOrgDto, 'body', true), */
organizations_controller_1.default.createOrg);
router.post(`/addUserToOrg`, 
/* authMiddleware,
grantAccess('createAny', 'OrganizationPermission'), */
/* validationMiddleware(CreateOrgDto, 'body', true), */
organizations_controller_1.default.addUserToOrg);
router.put(`/update/organization/:organizationId`, auth_middleware_1.default, (0, permission_middleware_1.grantAccess)('updateAny', 'OrganizationPermission'), 
/* validationMiddleware(UpdateOrgDto, 'body', true), */
organizations_controller_1.default.updateOrganization);
router.get(`/getOrganizations`, /* authMiddleware, superAdminAccess, */ organizations_controller_1.default.getAllOrgs);
router.get(`/getMyOrganizations`, auth_middleware_1.default, organizations_controller_1.default.getMyOrgs);
router.delete(`/delete/organization/:organizationId`, auth_middleware_1.default, permission_middleware_1.superAdminAccess, organizations_controller_1.default.deleteOrganization);
exports.default = router;
//# sourceMappingURL=organizations.route.js.map