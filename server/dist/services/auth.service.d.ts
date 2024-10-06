/// <reference types="mongoose" />
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
declare const _default: {
    signup: (userData: User, locale?: string) => Promise<{
        cookie: string;
        createdUser: User;
    }>;
    login: (userData: User, orgId?: string, locale?: string) => Promise<{
        cookie: string;
        findUser: User;
        token: {
            expiresIn: number;
            token: string;
        };
    }>;
    logout: (userData: User, locale?: string) => Promise<User>;
    verifyUserEmail: (userId: import("mongoose").Schema.Types.ObjectId, locale?: string) => Promise<User & import("mongoose").Document<any, any, any>>;
    forgotPassword: (email: string, subdomain: string, locale: string, logo: string, iconPage: string) => Promise<User>;
    resetPassword: (token: string, password: string, locale?: string) => Promise<User>;
    createToken: (user: User, expiresIn?: number) => {
        expiresIn: number;
        token: string;
    };
    verifyToken: (token: string, ignoreExpiration?: boolean) => DataStoredInToken;
    createCookie: (tokenData: TokenData) => string;
};
export default _default;
