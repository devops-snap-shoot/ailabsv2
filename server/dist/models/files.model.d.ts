import { File } from '../interfaces/file.interface';
import { Document } from 'mongoose';
declare const fileModel: import("mongoose").Model<File & Document<any, any, any>, {}, {}>;
export default fileModel;
