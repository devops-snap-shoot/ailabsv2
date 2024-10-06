import { Document, ObjectId } from 'mongoose';
declare const filesDataModel: import("mongoose").Model<{
    name: string;
    userId: ObjectId;
    id: number;
    messages: any[];
    chats: any[];
    url: string;
    createdAt: Date;
    updatedAt: Date;
    state: boolean;
} & Document<any, any, any>, {}, {}>;
export default filesDataModel;
