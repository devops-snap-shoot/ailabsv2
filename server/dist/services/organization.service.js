"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const i18n_1 = require("i18n");
const configs_1 = require("@/configs");
const organization_model_1 = (0, tslib_1.__importDefault)(require("@/models/organization.model"));
const HttpException_1 = require("@/exceptions/HttpException");
const organization_users_model_1 = (0, tslib_1.__importDefault)(require("@/models/organization-users.model"));
/**
 * Creates a new Organization
 * @param  {CreateOrgDto} orgInfo Organization data to create
 * @param  {string=env.locale} locale
 * @returns Object with organization information
 */
const createOrganization = async (orgInfo, locale = configs_1.env.locale) => {
    const count = await organization_model_1.default.countDocuments();
    orgInfo.idorg = count;
    const newOrganization = await organization_model_1.default.create(orgInfo);
    if (!newOrganization)
        throw new HttpException_1.HttpException(409, (0, i18n_1.__)({ phrase: 'Organization {{name}} already exists', locale }, { name: orgInfo.name }));
    return newOrganization;
};
const addUserToOrg = async (userId, orgId) => {
    const response = await organization_users_model_1.default.create({
        organization: orgId,
        users: userId
    });
    return response;
};
/**
 * Deletes an organization using id
 * @param  {string} organizationId Id of the Organization to delete
 * @param  {string=env.locale} locale
 * @returns Object with the information of the deleted organization
 */
const deleteOrgById = async (organizationId, locale = configs_1.env.locale) => {
    const deleted = await organization_model_1.default.findByIdAndDelete(organizationId);
    if (!deleted)
        throw new HttpException_1.HttpException(404, (0, i18n_1.__)({ phrase: 'Oganization not found', locale }));
    return deleted;
};
/**
 * Search for all organizations in the data base
 * @returns Array of organizations
 */
const getOrganizations = async () => {
    const organizations = await organization_model_1.default.find();
    return organizations;
};
/**
 * Update an organization
 * @param  {string} organizationId Id of the organization to update
 * @param  {object} organizationData Data to update
 * @param  {string=env.locale} locale
 * @returns Object with the updated organization
 */
const updateOrgById = async (organizationId, organizationData, locale = configs_1.env.locale) => {
    const updated = await organization_model_1.default.findByIdAndUpdate(organizationId, organizationData, { new: true });
    if (!updated)
        throw new HttpException_1.HttpException(404, (0, i18n_1.__)({ phrase: 'Oganization not found', locale }));
    return updated;
};
exports.default = { createOrganization, addUserToOrg, deleteOrgById, getOrganizations, updateOrgById };
//# sourceMappingURL=organization.service.js.map