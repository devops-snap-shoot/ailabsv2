"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const index_1 = require("@configs/index");
const HttpException_1 = require("@exceptions/HttpException");
const users_model_1 = (0, tslib_1.__importDefault)(require("@models/users.model"));
const util_1 = require("@utils/util");
const logger_1 = require("@/utils/logger");
const html_1 = require("@/utils/html");
const bcrypt_1 = (0, tslib_1.__importDefault)(require("bcrypt"));
const i18n_1 = require("i18n");
const jsonwebtoken_1 = (0, tslib_1.__importDefault)(require("jsonwebtoken"));
const email_service_1 = require("./email.service");
const path_1 = (0, tslib_1.__importDefault)(require("path"));
const env_1 = require("@/configs/env");
const smtp_1 = (0, tslib_1.__importDefault)(require("@/configs/smtp"));
/* import avatarModel from '@/models/avatares.model' */
const user = users_model_1.default;
const signup = async (userData, locale = index_1.env.locale) => {
    if ((0, util_1.isEmpty)(userData))
        throw new HttpException_1.HttpException(400, (0, i18n_1.__)({ phrase: 'Credentials are required', locale }));
    const findUser = await user.findOne({ email: userData.email }).populate('roles');
    if (findUser)
        throw new HttpException_1.HttpException(409, (0, i18n_1.__)({ phrase: 'Email {{email}} already exists', locale }, { email: userData.email }));
    const hashedPassword = await bcrypt_1.default.hash(userData.password, 10);
    const createUserData = await user.create(Object.assign(Object.assign({}, userData), { password: hashedPassword }));
    const loginToken = createToken(createUserData);
    const cookie = createCookie(loginToken);
    const verificationToken = createToken(createUserData, 0);
    const args = {
        fullName: `${createUserData.name} ${createUserData.lastName}`,
        email: createUserData.email,
        verifyLink: (0, util_1.asset)(`/verify?token=${verificationToken.token}`),
        platformURL: index_1.env.url,
        platformName: index_1.env.platformName
    };
    (0, email_service_1.sendHTMLEmail)(createUserData.email, (0, i18n_1.__)({ phrase: 'Verify your email', locale }), (0, html_1.generateHTML)(path_1.default.join(__dirname, `/../email.templates/verify.email.template/${locale}.html`), args), { attachments: [{ filename: 'logo.png', path: (0, util_1.frontendAsset)('images/logo.png'), cid: 'logo' }] }).catch(err => logger_1.logger.error((0, i18n_1.__)({ phrase: err.message, locale })));
    return { cookie, createdUser: createUserData };
};
const login = async (userData, orgId, locale = index_1.env.locale) => {
    console.log(userData, locale);
    if ((0, util_1.isEmpty)(userData))
        throw new HttpException_1.HttpException(400, (0, i18n_1.__)({ phrase: 'Credentials are required', locale }));
    const findUser = (await user.findOne({ email: userData.email }).populate('roles').populate('speciality').populate('organization').populate('userOtherData'));
    if (!findUser)
        throw new HttpException_1.HttpException(410, (0, i18n_1.__)({ phrase: 'Email {{email}} not found', locale }, { email: userData.email }));
    const userOrgId = findUser.organization[0];
    const role = findUser.roles[0];
    /* const avatars = await avatarModel.find({users: {'$in': [findUser._id]}}) */
    if (role.name === 'SuperAdmin') {
        console.log(findUser.roles[0]);
        const isPasswordMatching = await bcrypt_1.default.compare(userData.password, findUser.password);
        if (!isPasswordMatching)
            throw new HttpException_1.HttpException(409, (0, i18n_1.__)({ phrase: 'Wrong password', locale }));
        const token = createToken(findUser, 86400);
        const cookie = createCookie(token);
        /* const avatars = await avatarModel.find({users: {'$in': [findUser._id]}}) */
        return { cookie, findUser, token };
    }
    else if ((userOrgId && orgId) && (userOrgId.toString() === orgId.toString())) {
        const isPasswordMatching = await bcrypt_1.default.compare(userData.password, findUser.password);
        if (!isPasswordMatching)
            throw new HttpException_1.HttpException(409, (0, i18n_1.__)({ phrase: 'Wrong password', locale }));
        const token = createToken(findUser, 86400);
        const cookie = createCookie(token);
        return { cookie, findUser, token };
    }
    else {
        const isPasswordMatching = await bcrypt_1.default.compare(userData.password, findUser.password);
        if (!isPasswordMatching)
            throw new HttpException_1.HttpException(409, (0, i18n_1.__)({ phrase: 'Wrong password', locale }));
        const token = createToken(findUser, 86400);
        const cookie = createCookie(token);
        /* const avatars = await avatarModel.find({users: {'$in': [findUser._id]}}) */
        return { cookie, findUser, token };
        /* throw new HttpException(410, __({ phrase: 'organization not user', locale }, { email: userData.email })) */
    }
};
const logout = async (userData, locale = index_1.env.locale) => {
    if ((0, util_1.isEmpty)(userData))
        throw new HttpException_1.HttpException(400, (0, i18n_1.__)({ phrase: 'Credentials are required', locale }));
    const findUser = await user.findOne({ email: userData.email /* , password: userData.password */ });
    if (!findUser)
        throw new HttpException_1.HttpException(409, (0, i18n_1.__)({ phrase: 'Email {{email}} not found', locale }, { email: userData.email }));
    return findUser;
};
const verifyUserEmail = async (userId, locale = index_1.env.locale) => {
    if ((0, util_1.isEmpty)(userId))
        throw new HttpException_1.HttpException(400, (0, i18n_1.__)({ phrase: 'An ID is required', locale }));
    let findUser = await user.findOne({ _id: userId });
    if (!findUser)
        throw new HttpException_1.HttpException(409, (0, i18n_1.__)({ phrase: 'User not found', locale }));
    findUser.emailVerifiedAt = new Date();
    findUser = await findUser.save();
    if (!findUser)
        throw new HttpException_1.HttpException(409, (0, i18n_1.__)({ phrase: 'Unable to update user', locale }));
    return findUser;
};
/**
 * Initiates reset password process for a given email
 * @param {*} email Email for which to initiate the reset password process
 * @returns Object, data to generate email to send (reset token, fullname, email)
 */
const forgotPassword = async (email, subdomain, locale = index_1.env.locale, logo, iconPage) => {
    console.log(email);
    console.log(locale);
    console.log(subdomain);
    const findUser = await user.findOneAndUpdate({ email }, { updatedAt: new Date() }, { new: true, timestamps: false });
    if ((0, util_1.isEmpty)(findUser))
        throw new HttpException_1.HttpException(409, (0, i18n_1.__)({ phrase: 'Email {{email}} not found', locale }, { email }));
    const resetToken = createToken(findUser);
    console.log(resetToken.token);
    const args = {
        fullName: `${findUser.name} ${findUser.lastName}`,
        resetLink: (env_1.environment === 'production') ? `https://app.ai-labhelper.com/login/${resetToken.token}` : `http://localhost:8101/login/${resetToken.token}`,
        logo: 'https://app.ai-labhelper.com/assets/icon/logo-ailab.png',
        buttonStyle: 'default'
    };
    console.log((0, util_1.frontendAsset)('assets/images/Imkchat.png'));
    console.log(path_1.default.join(__dirname, `/../../email.templates/reset.password.template/${locale}.html`));
    const optionals = {
        from: {
            name: smtp_1.default.from_name,
            address: smtp_1.default.from_email
        },
        /* attachments: [{ filename: 'Imkchat.png', path: frontendAsset('assets/images/Imkchat.png'), cid: 'logo' }] */
    };
    const data = await (0, email_service_1.sendHTMLEmail)(findUser.email, 'Reset your password', (0, html_1.generateHTML)(path_1.default.join(__dirname, `/../../email.templates/reset.password.template/${locale}.html`), args), optionals);
    if (env_1.environment === 'development') {
        console.log(data);
    }
    return findUser;
};
/**
 * Resets password for a given token
 * @param {string} token Token to reset password
 * @param {string} password New password
 * @returns {User} data of the updated user
 */
const resetPassword = async (token, password, locale = index_1.env.locale) => {
    if ((0, util_1.isEmpty)(token))
        throw new HttpException_1.HttpException(400, (0, i18n_1.__)({ phrase: 'Token is required', locale }));
    if ((0, util_1.isEmpty)(password))
        throw new HttpException_1.HttpException(400, (0, i18n_1.__)({ phrase: 'Password is required', locale }));
    const tokenData = verifyToken(token);
    if (!tokenData)
        throw new HttpException_1.HttpException(409, (0, i18n_1.__)({ phrase: 'Invalid token', locale }));
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const findUser = await user.findOneAndUpdate({ _id: tokenData._id }, { password: hashedPassword }, { new: true });
    if (!findUser)
        throw new HttpException_1.HttpException(409, (0, i18n_1.__)({ phrase: 'User not found', locale }));
    return findUser;
};
const createToken = (user, expiresIn = 3600) => {
    const dataStoredInToken = { _id: user._id }; // user._id, [organizationId, resources]
    const secretKey = index_1.keys.secretKey;
    return { expiresIn, token: jsonwebtoken_1.default.sign(dataStoredInToken, secretKey, { expiresIn }) };
};
const verifyToken = (token, ignoreExpiration = false) => {
    const secretKey = index_1.keys.secretKey;
    return jsonwebtoken_1.default.verify(token, secretKey, { ignoreExpiration });
};
const createCookie = (tokenData) => {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
};
exports.default = {
    signup,
    login,
    logout,
    verifyUserEmail,
    forgotPassword,
    resetPassword,
    createToken,
    verifyToken,
    createCookie
};
//# sourceMappingURL=auth.service.js.map