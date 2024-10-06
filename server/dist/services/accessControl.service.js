"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const accesscontrol_1 = require("accesscontrol");
const bcrypt_1 = (0, tslib_1.__importDefault)(require("bcrypt"));
const i18n_1 = require("i18n");
const users_model_1 = (0, tslib_1.__importDefault)(require("@/models/users.model"));
const util_1 = require("@/utils/util");
const configs_1 = require("@/configs");
const HttpException_1 = require("@/exceptions/HttpException");
const roles_model_1 = (0, tslib_1.__importDefault)(require("@/models/roles.model"));
const roles_config_1 = require("@/configs/roles.config");
const ac = new accesscontrol_1.AccessControl();
const initAccessControl = async () => {
    try {
        const findRole = await roles_model_1.default.findOne({ name: roles_config_1.superAdmin.name });
        let adminResult = '';
        if (findRole) {
            await updateSuperAdmin(findRole._id, roles_config_1.superAdmin.resources);
            adminResult = 'Super admin Role updated';
        }
        else {
            await createRoleAdmin(roles_config_1.superAdmin);
            adminResult = 'Super admin Role created';
        }
        console.info(`Initialized access control. ${adminResult}`);
    }
    catch (error) {
        console.error('ERROR: ', error);
    }
};
const createRole = async (roleInfo, org) => {
    const newRole = roles_model_1.default.create({
        name: roleInfo.name,
        organizationId: org,
        resources: roleInfo.resources,
        description: roleInfo.description
    });
    return newRole;
};
const createGlobalRole = async (roleInfo, rolesMatchs, locale = configs_1.env.locale) => {
    if (rolesMatchs) {
        try {
            const newRole = roles_model_1.default.create({
                name: roleInfo.name,
                resources: roleInfo.resources,
                description: roleInfo.description
            });
            await updateAccessControl();
            return newRole;
        }
        catch (error) {
            throw new HttpException_1.HttpException(409, (0, i18n_1.__)({ phrase: 'Role already exists', locale }));
        }
    }
    else
        throw new HttpException_1.HttpException(409, (0, i18n_1.__)({ phrase: 'You do not have permission to create that role', locale }));
};
const updateSuperAdmin = async (roleId, newResources) => {
    try {
        const updated = await roles_model_1.default.findByIdAndUpdate(roleId, { resources: newResources }, { new: true });
        if (!updated) {
            throw new Error();
        }
        await updateAccessControl();
        return updated;
    }
    catch (error) {
        // Add error message to be sent
        throw new Error(error.message);
    }
};
const createRoleAdmin = async (roleInfo) => {
    try {
        const findAdmin = await users_model_1.default.findOne({ email: configs_1.env.email }); // Ensure roles is an array of strings and includes save
        const newRole = new roles_model_1.default({
            name: roleInfo.name,
            resources: roleInfo.resources
        });
        await newRole.save();
        findAdmin.roles.push(newRole._id.toString()); // Ensure _id is converted to string
        await findAdmin.save(); // Added await for save
        await updateAccessControl();
        return newRole;
    }
    catch (error) {
        // Add error message to be sent
        throw new Error(error.message);
    }
};
const updateAccessControl = async () => {
    const parsedRoles = {};
    ac.setGrants(parsedRoles);
    return 'Access Control updated';
};
const check = (role, resource, type) => {
    const typeResponses = {
        createAny: ac.can(role.toString()).createAny(resource),
        readAny: ac.can(role.toString()).readAny(resource),
        updateAny: ac.can(role.toString()).updateAny(resource),
        deleteAny: ac.can(role.toString()).deleteAny(resource),
        createOwn: ac.can(role.toString()).createOwn(resource),
        readOwn: ac.can(role.toString()).readOwn(resource),
        updateOwn: ac.can(role.toString()).updateOwn(resource),
        deleteOwn: ac.can(role.toString()).deleteOwn(resource)
    };
    if (!Object.keys(typeResponses).includes(type))
        return ac.can(role.toString()).readAny('NONRESOURCE');
    return typeResponses[type];
};
const createSuperAdmin = async () => {
    console.log('createUser');
    const hashedPassword = await bcrypt_1.default.hash(configs_1.env.password, 10);
    const user = await users_model_1.default.findOneAndUpdate({ email: configs_1.env.email }, {
        $setOnInsert: Object.assign(Object.assign({ name: configs_1.env.name }, (!(0, util_1.isEmpty)(configs_1.env.lastName) && { lastName: configs_1.env.lastName })), { email: configs_1.env.email, run: configs_1.env.run, password: hashedPassword, state: true })
    }, { new: true, upsert: true });
    return user;
};
const updateRole = async (roleInfo, locale = configs_1.env.locale) => {
    const updated = await roles_model_1.default.findByIdAndUpdate(roleInfo._id, {
        name: roleInfo.name,
        resources: roleInfo.resources,
        description: roleInfo.description
    }, { new: true });
    if (!updated)
        throw new HttpException_1.HttpException(409, (0, i18n_1.__)({ phrase: 'Role not found', locale }));
    await updateAccessControl();
    return updated;
};
const deleteRole = async (roleId, locale = configs_1.env.locale) => {
    const deleted = await roles_model_1.default.findByIdAndDelete(roleId);
    if (!deleted)
        throw new HttpException_1.HttpException(409, (0, i18n_1.__)({ phrase: 'Role not found', locale }));
    await updateAccessControl();
    return deleted;
};
const findRolesByOrg = async (orgInfo) => {
    const roles = await roles_model_1.default.find({ organizationId: orgInfo });
    return roles;
};
const findAllRoles = async () => {
    const roles = await roles_model_1.default.find().populate('organizationId');
    return roles;
};
const updateRoleById = async (roleId, roleData, locale = configs_1.env.locale) => {
    const updated = await roles_model_1.default.findByIdAndUpdate(roleId, roleData, { new: true });
    if (!updated)
        throw new HttpException_1.HttpException(404, (0, i18n_1.__)({ phrase: 'Role not found', locale }));
    await updateAccessControl();
    return updated;
};
exports.default = {
    ac,
    check,
    createSuperAdmin,
    initAccessControl,
    updateAccessControl,
    createRole,
    createGlobalRole,
    updateRole,
    deleteRole,
    findRolesByOrg,
    findAllRoles,
    updateRoleById
};
//# sourceMappingURL=accessControl.service.js.map