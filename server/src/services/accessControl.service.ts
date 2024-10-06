import { AccessControl } from 'accesscontrol'
import bcrypt from 'bcrypt'
import { __ } from 'i18n'
import { ObjectId } from 'mongoose'
import { User } from '@/interfaces/users.interface'
import userModel from '@/models/users.model'
import { isEmpty } from '@/utils/util'
import { env } from '@/configs'
import { HttpException } from '@/exceptions/HttpException'
import RoleModel from '@/models/roles.model'
import { superAdmin } from '@/configs/roles.config'
import { CreateRoleDto, UpdateRoleDto } from '@/dtos/roles.dto'
import { Organization, Role } from '@interfaces/roles.interface'

const ac = new AccessControl()

const initAccessControl = async () => {
    try {
        const findRole = await RoleModel.findOne({ name: superAdmin.name })
        let adminResult = ''
        if (findRole) {
            await updateSuperAdmin(findRole._id, superAdmin.resources)
            adminResult = 'Super admin Role updated'
        } else {
            await createRoleAdmin(superAdmin)
            adminResult = 'Super admin Role created'
        }
        console.info(`Initialized access control. ${adminResult}`)
    } catch (error) {
        console.error('ERROR: ', error)
    }
}

const createRole = async (
    roleInfo: Role,
    org: string,
): Promise<Role> => {
    const newRole = RoleModel.create({
        name: roleInfo.name,
        organizationId: org,
        resources: roleInfo.resources,
        description: roleInfo.description
    })
    return newRole
}

const createGlobalRole = async (
    roleInfo: CreateRoleDto,
    rolesMatchs: boolean,
    locale: string = env.locale
): Promise<Role> => {
    if (rolesMatchs) {
        try {
            const newRole = RoleModel.create({
                name: roleInfo.name,
                resources: roleInfo.resources,
                description: roleInfo.description
            })
            await updateAccessControl()
            return newRole
        } catch (error) {
            throw new HttpException(409, __({ phrase: 'Role already exists', locale }))
        }
    } else throw new HttpException(409, __({ phrase: 'You do not have permission to create that role', locale }))
}

const updateSuperAdmin = async (roleId: ObjectId, newResources: object) => {
    try {
        const updated = await RoleModel.findByIdAndUpdate(roleId, { resources: newResources }, { new: true })
        if (!updated) {
            throw new Error()
        }
        await updateAccessControl()
        return updated
    } catch (error) {
        // Add error message to be sent
        throw new Error(error.message)
    }
}

const createRoleAdmin = async (roleInfo: CreateRoleDto): Promise<Role> => {
    try {
     
    const findAdmin = await userModel.findOne({ email: env.email }) as unknown as User & { roles: string[]; save: () => Promise<void> }; // Ensure roles is an array of strings and includes save
       const newRole = new RoleModel({
            name: roleInfo.name,
            resources: roleInfo.resources
        })
        await newRole.save()
        findAdmin.roles.push(newRole._id.toString()); // Ensure _id is converted to string
        await findAdmin.save() // Added await for save
        await updateAccessControl()
        return newRole
    } catch (error) {
        // Add error message to be sent
        throw new Error(error.message)
    }
}

const updateAccessControl = async () => {
    const parsedRoles = {}
    ac.setGrants(parsedRoles)
    return 'Access Control updated'
}

const check = (role: ObjectId, resource: string, type: string) => {
    const typeResponses = {
        createAny: ac.can(role.toString()).createAny(resource),
        readAny: ac.can(role.toString()).readAny(resource),
        updateAny: ac.can(role.toString()).updateAny(resource),
        deleteAny: ac.can(role.toString()).deleteAny(resource),
        createOwn: ac.can(role.toString()).createOwn(resource),
        readOwn: ac.can(role.toString()).readOwn(resource),
        updateOwn: ac.can(role.toString()).updateOwn(resource),
        deleteOwn: ac.can(role.toString()).deleteOwn(resource)
    }
    if (!Object.keys(typeResponses).includes(type)) return ac.can(role.toString()).readAny('NONRESOURCE')
    return typeResponses[type]
}

const createSuperAdmin = async (): Promise<User> => {
    console.log('createUser')
    const hashedPassword = await bcrypt.hash(env.password, 10)
    const user: User = await userModel.findOneAndUpdate(
        { email: env.email },
        {
            $setOnInsert: {
                name: env.name,
                ...(!isEmpty(env.lastName) && { lastName: env.lastName }),
                email: env.email,
                run: env.run,
                password: hashedPassword,
                state: true
            }
        },
        { new: true, upsert: true }
    )
    return user
}

const updateRole = async (roleInfo: Role, locale: string = env.locale) => {
    const updated = await RoleModel.findByIdAndUpdate(
        roleInfo._id,
        {
            name: roleInfo.name,
            resources: roleInfo.resources,
            description: roleInfo.description
        },
        { new: true }
    )
    if (!updated) throw new HttpException(409, __({ phrase: 'Role not found', locale }))
    await updateAccessControl()
    return updated
}

const deleteRole = async (roleId: string, locale: string = env.locale) => {
    const deleted = await RoleModel.findByIdAndDelete(roleId)
    if (!deleted) throw new HttpException(409, __({ phrase: 'Role not found', locale }))
    await updateAccessControl()
    return deleted
}

const findRolesByOrg = async (orgInfo: any): Promise<Role[]> => {
    const roles: Role[] = await RoleModel.find({ organizationId: orgInfo })

    return roles
}

const findAllRoles = async (): Promise<Role[]> => {
    const roles: Role[] = await RoleModel.find().populate('organizationId')

    return roles
}

const updateRoleById = async (roleId: string, roleData: UpdateRoleDto, locale: string = env.locale): Promise<Role> => {
    const updated = await RoleModel.findByIdAndUpdate(roleId, roleData, { new: true })
    if (!updated) throw new HttpException(404, __({ phrase: 'Role not found', locale }))
    await updateAccessControl()
    return updated
}

export default {
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
}
