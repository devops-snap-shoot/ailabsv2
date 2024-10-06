import { Document } from 'mongoose';
declare const chatsModel: import("mongoose").Model<{
    user: any;
    token: string;
    timeLimit: Date;
    messages: any[];
    createdAt: Date;
    updatedAt: Date;
    state: boolean;
} & Document<any, any, any>, {}, {}>;
export default chatsModel;
