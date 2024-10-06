"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.superAdminAccess = exports.grantAccess = void 0;
const tslib_1 = require("tslib");
const accessControl_service_1 = (0, tslib_1.__importDefault)(require("@/services/accessControl.service"));
const HttpException_1 = require("@/exceptions/HttpException");
const roles_model_1 = (0, tslib_1.__importDefault)(require("@/models/roles.model"));
const roles_config_1 = require("@/configs/roles.config");
/**
 * Middleware that grants or deny access
 * @param  {string=null} action action to perform
 * @param  {string=null} resource resource to access
 */
const grantAccess = function (action = null, resource = null) {
    return async (req, res, next) => {
        // Check if the user has at least one role
        if (!Array.isArray(req.user.roles) || !req.user.roles.length) {
            return next(new HttpException_1.HttpException(401, 'You do not have enough permission to perform this action'));
        }
        // Check if the user has a global Role
        const roles = req.user.roles;
        const globalRoleFound = roles.find((role) => {
            return !role.organizationId;
        });
        // If the use has a global role check if it has permission
        if (globalRoleFound) {
            if (globalRoleFound.name === roles_config_1.superAdmin.name) {
                req.role = globalRoleFound;
                return next();
            }
            const permission = accessControl_service_1.default.check(globalRoleFound._id, resource, action);
            if (permission.granted) {
                req.role = globalRoleFound;
                return next();
            }
        }
        try {
            let org = req.params.organizationId;
            // if there is no organization in the request, search for role in request
            // and query the role, to get organization
            if (!org) {
                const roleId = req.params.roleId || req.body._id;
                if (roleId) {
                    const findRoleData = await roles_model_1.default.findById(roleId, 'organizationId');
                    org = findRoleData.organizationId.toString();
                }
            }
            // search if the user has a role that is assigned to the organization to make an action
            const roleFound = roles.find(obj => {
                if (obj.organizationId && org === obj.organizationId._id.toString()) {
                    return obj.organizationId;
                }
                else
                    return null;
            });
            // if the user has a role that match an organization then check if it has permission
            if (roleFound) {
                const permission = accessControl_service_1.default.check(roleFound._id, resource, action);
                if (!permission.granted) {
                    return next(new HttpException_1.HttpException(401, 'You do not have enough permission to perform this action'));
                }
            }
            else {
                return next(new HttpException_1.HttpException(401, 'You do not have enough permission to perform this action'));
            }
            req.role = roleFound;
            return next();
        }
        catch (_a) {
            return next(new HttpException_1.HttpException(401, 'You do not have enough permission to perform this action'));
        }
    };
};
exports.grantAccess = grantAccess;
/**
 * Middleware that grants or deny access if the user is super admin
 */
const superAdminAccess = function () {
    return async (req, res, next) => {
        if (!Array.isArray(req.user.roles) || !req.user.roles.length)
            next(new HttpException_1.HttpException(401, 'You do not have enough permission to perform this action'));
        try {
            const roles = req.user.roles;
            const superAdminFound = roles.find(role => {
                return role.name === roles_config_1.superAdmin.name && !role.organizationId;
            });
            if (superAdminFound) {
                next();
                req.role = superAdminFound;
                return;
            }
            else {
                return next(new HttpException_1.HttpException(401, 'You do not have enough permission to perform this action'));
            }
        }
        catch (error) {
            return next(new HttpException_1.HttpException(401, 'You do not have enough permission to perform this action'));
        }
    };
};
exports.superAdminAccess = superAdminAccess;
//# sourceMappingURL=permission.middleware.js.map