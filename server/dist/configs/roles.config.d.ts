declare const superAdmin: {
    name: string;
    resources: {
        User: {
            'create:any': string[];
            'read:any': string[];
            'update:any': string[];
            'delete:any': string[];
        };
        RolePermission: {
            'create:any': string[];
            'read:any': string[];
            'update:any': string[];
            'delete:any': string[];
        };
        OrganizationPermission: {
            'create:any': string[];
            'read:any': string[];
            'update:any': string[];
            'delete:any': string[];
        };
    };
    description: string;
};
declare const admin: {
    adminRole: {
        name: string;
        resources: {
            User: {
                'create:any': string[];
                'read:any': string[];
                'update:any': string[];
                'delete:any': string[];
            };
            RolePermission: {
                'create:any': string[];
                'read:any': string[];
                'update:any': string[];
                'delete:any': string[];
            };
        };
    };
};
declare const user: {
    userRole: {
        name: string;
        resources: {
            User: {
                'create:own': string[];
                'read:own': string[];
                'update:own': string[];
                'delete:own': string[];
            };
        };
    };
};
export { admin, user, superAdmin };
