import { __ } from 'i18n'
import { env } from '@/configs'
import { CreateOrgDto } from '@/dtos/organizations.dto'
import OrganizationModel from '@/models/organization.model'
import { HttpException } from '@/exceptions/HttpException'
import { Organization } from '@/interfaces/roles.interface'
import organizationUsersModel from '@/models/organization-users.model'
/**
 * Creates a new Organization
 * @param  {CreateOrgDto} orgInfo Organization data to create
 * @param  {string=env.locale} locale
 * @returns Object with organization information
 */
const createOrganization = async (orgInfo: Organization, locale: string = env.locale): Promise<Organization> => {
    const count = await OrganizationModel.countDocuments()
    orgInfo.idorg = count
    const newOrganization = await OrganizationModel.create(orgInfo)
    if (!newOrganization)
        throw new HttpException(
            409,
            __({ phrase: 'Organization {{name}} already exists', locale }, { name: orgInfo.name })
        )
    return newOrganization
}

const addUserToOrg = async (userId: string, orgId: string): Promise<any> => {
    const response = await organizationUsersModel.create({
        organization: orgId,
        users: userId
    })

    return response
}

/**
 * Deletes an organization using id
 * @param  {string} organizationId Id of the Organization to delete
 * @param  {string=env.locale} locale
 * @returns Object with the information of the deleted organization
 */
const deleteOrgById = async (organizationId: string, locale: string = env.locale): Promise<Organization> => {
    const deleted = await OrganizationModel.findByIdAndDelete(organizationId)
    if (!deleted) throw new HttpException(404, __({ phrase: 'Oganization not found', locale }))
    return deleted
}

/**
 * Search for all organizations in the data base
 * @returns Array of organizations
 */
const getOrganizations = async (): Promise<Organization[]> => {
    const organizations = await OrganizationModel.find()
    return organizations
}

/**
 * Update an organization
 * @param  {string} organizationId Id of the organization to update
 * @param  {object} organizationData Data to update
 * @param  {string=env.locale} locale
 * @returns Object with the updated organization
 */
const updateOrgById = async (
    organizationId: string,
    organizationData: object,
    locale: string = env.locale
): Promise<Organization> => {
    const updated = await OrganizationModel.findByIdAndUpdate(organizationId, organizationData, { new: true })
    if (!updated) throw new HttpException(404, __({ phrase: 'Oganization not found', locale }))
    return updated
}

export default { createOrganization, addUserToOrg, deleteOrgById, getOrganizations, updateOrgById }
