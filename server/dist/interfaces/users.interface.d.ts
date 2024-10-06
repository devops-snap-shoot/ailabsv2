import { ObjectId } from 'mongoose';
import { Organization, Role } from './roles.interface';
export interface User {
    _id?: ObjectId;
    name: string;
    lastName: string;
    secondLastName: string;
    run: string;
    phone: string;
    address: string;
    region: string;
    city: string;
    nacionality: string;
    birthdate: string;
    gender: string;
    email: string;
    password: string;
    passwordProvisory: string;
    emailVerifiedAt: Date;
    state: boolean;
    profileImage: string;
    createdAt: Date;
    updatedAt: Date;
    product_id: string;
    product_type: string;
    product_name: string;
    totalDocsByMonth: number;
    payment_status: string;
    subdomain: string;
    image: string;
    roles: Role[] | string[];
    organization: Organization[] | string[];
    speciality: any[] | string[];
    userOtherData: UserOtherDate;
}
export interface UserOtherDate {
    institutions: string[];
    sector: string;
    graduationUniversity: string;
    tastes: {
        montain: boolean;
        sea: boolean;
        hobbie: string;
        collectibles: string[];
        politicalTrend: string;
        personalAppearance: string;
        physicalBuild: string;
        pet: string;
        maritalStatus: string;
        foods: string;
        music: string;
        socialStratum: string;
        socialProfile: string;
    };
    workData: {
        telemedicine: boolean;
        healthForecast: {
            fonasa: boolean;
            banmedica: boolean;
            cruzBlanca: boolean;
            consalud: boolean;
            vidaTres: boolean;
            nuevaMasVida: boolean;
        };
        kardex: string;
    };
}
