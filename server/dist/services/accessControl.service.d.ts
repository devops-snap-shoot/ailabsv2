/// <reference types="mongoose" />
import { AccessControl } from 'accesscontrol';
import { User } from '@/interfaces/users.interface';
import { CreateRoleDto, UpdateRoleDto } from '@/dtos/roles.dto';
import { Role } from '@interfaces/roles.interface';
declare const _default: {
    ac: AccessControl;
    check: (role: import("mongoose").Schema.Types.ObjectId, resource: string, type: string) => any;
    createSuperAdmin: () => Promise<User>;
    initAccessControl: () => Promise<void>;
    updateAccessControl: () => Promise<string>;
    createRole: (roleInfo: Role, org: string) => Promise<Role>;
    createGlobalRole: (roleInfo: CreateRoleDto, rolesMatchs: boolean, locale?: string) => Promise<Role>;
    updateRole: (roleInfo: Role, locale?: string) => Promise<Role & import("mongoose").Document<any, any, any>>;
    deleteRole: (roleId: string, locale?: string) => Promise<Role & import("mongoose").Document<any, any, any>>;
    findRolesByOrg: (orgInfo: any) => Promise<Role[]>;
    findAllRoles: () => Promise<Role[]>;
    updateRoleById: (roleId: string, roleData: UpdateRoleDto, locale?: string) => Promise<Role>;
};
export default _default;
