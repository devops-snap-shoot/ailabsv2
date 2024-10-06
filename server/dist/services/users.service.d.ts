import { User } from '@interfaces/users.interface';
declare const _default: {
    findAllUser: () => Promise<User[]>;
    findUsersByCompany: (companyId: any) => Promise<User[]>;
    findSupervisores: () => Promise<User[]>;
    findOperadores: () => Promise<User[]>;
    findUserById: (userId: string, locale?: string) => Promise<User>;
    editUser: (usuario: User, locale?: string) => Promise<User>;
    findUsersByRole: (role: string) => Promise<User[]>;
    createUser: (userData: User, locale?: string) => Promise<User>;
    updateUser: (userId: string, userData: User, locale?: string) => Promise<User>;
    deleteUser: (userId: string, locale?: string) => Promise<User>;
    createUserMasive: (userData: User, locale: string, specialityName: string, organizationId: string) => Promise<User>;
};
export default _default;
