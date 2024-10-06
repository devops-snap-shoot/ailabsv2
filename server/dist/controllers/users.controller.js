"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const env_1 = require("@configs/env");
const users_service_1 = (0, tslib_1.__importDefault)(require("@services/users.service"));
const getUsers = async (req, res, next) => {
    try {
        const findAllUsersData = await users_service_1.default.findAllUser();
        res.status(200).json({ data: findAllUsersData, message: 'findAll' });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
};
const getUsersByCompany = async (req, res, next) => {
    const { companyId } = req.params;
    try {
        const findAllUsersData = await users_service_1.default.findUsersByCompany(companyId);
        res.status(200).json({ data: findAllUsersData, message: 'findAll' });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
};
const getUserById = async (req, res, next) => {
    try {
        const userId = req.body.id;
        const userLocale = req.cookies.language || env_1.locale;
        const findOneUserData = await users_service_1.default.findUserById(userId, userLocale);
        res.status(200).json({ data: findOneUserData, message: 'findOne' });
    }
    catch (error) {
        next(error);
    }
};
const createUser = async (req, res, next) => {
    try {
        const userData = req.body;
        const userLocale = req.cookies.language || env_1.locale;
        const createUserData = await users_service_1.default.createUser(userData, userLocale);
        res.status(201).json({ data: createUserData, message: 'created' });
    }
    catch (error) {
        next(error);
    }
};
const editUser = async (req, res, next) => {
    try {
        const userData = req.body;
        console.log(userData);
        const updateUserData = await users_service_1.default.editUser(userData);
        console.log(updateUserData);
        res.status(200).json({ data: updateUserData, message: 'updated' });
    }
    catch (error) {
        next(error);
    }
};
const deleteUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const userLocale = req.cookies.language || env_1.locale;
        const deleteUserData = await users_service_1.default.deleteUser(userId, userLocale);
        res.status(200).json({ data: deleteUserData, message: 'deleted' });
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    getUsers,
    getUsersByCompany,
    getUserById,
    createUser,
    editUser,
    deleteUser
};
//# sourceMappingURL=users.controller.js.map