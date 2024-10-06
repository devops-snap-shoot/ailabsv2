import { OrganizationUsers } from '@/interfaces/roles.interface';
import { Document } from 'mongoose';
declare const organizationUsersModel: import("mongoose").Model<OrganizationUsers & Document<any, any, any>, {}, {}>;
export default organizationUsersModel;
