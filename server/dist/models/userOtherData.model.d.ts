import { UserOtherDate } from '@/interfaces/users.interface';
import { Document } from 'mongoose';
declare const userOtherDataModel: import("mongoose").Model<UserOtherDate & Document<any, any, any>, {}, {}>;
export default userOtherDataModel;
