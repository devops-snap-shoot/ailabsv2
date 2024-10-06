"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.superAdmin = exports.user = exports.admin = void 0;
const superAdmin = {
    name: 'SuperAdmin',
    resources: {
        User: {
            'create:any': ['*'],
            'read:any': ['*'],
            'update:any': ['*'],
            'delete:any': ['*']
        },
        RolePermission: {
            'create:any': ['*'],
            'read:any': ['*'],
            'update:any': ['*'],
            'delete:any': ['*']
        },
        OrganizationPermission: {
            'create:any': ['*'],
            'read:any': ['*'],
            'update:any': ['*'],
            'delete:any': ['*']
        }
    },
    description: ''
};
exports.superAdmin = superAdmin;
const admin = {
    adminRole: {
        name: 'admin',
        resources: {
            User: {
                'create:any': ['*'],
                'read:any': ['*'],
                'update:any': ['*'],
                'delete:any': ['*']
            },
            RolePermission: {
                'create:any': ['*'],
                'read:any': ['*'],
                'update:any': ['*'],
                'delete:any': ['*']
            }
        }
    }
};
exports.admin = admin;
const user = {
    userRole: {
        name: 'user',
        resources: {
            User: {
                'create:own': ['*'],
                'read:own': ['*'],
                'update:own': ['*'],
                'delete:own': ['*']
            }
        }
    }
};
exports.user = user;
//# sourceMappingURL=roles.config.js.map