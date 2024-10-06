/// <reference types="qs" />
import { Response, Request, NextFunction } from 'express';
interface CustomRequest extends Request {
    files?: any;
}
declare const _default: {
    uploadImage: (req: CustomRequest, res: Response<any, Record<string, any>>, next: NextFunction) => Promise<void>;
    uploadAudio: (req: CustomRequest, res: Response<any, Record<string, any>>, next: NextFunction) => Promise<void>;
    uploadDocument: (req: CustomRequest, res: Response<any, Record<string, any>>, next: NextFunction) => Promise<void>;
    deleteFile: (req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, next: NextFunction) => Promise<void>;
    internalUploadDocument: (doc: any) => Promise<string>;
    uploadAudioAvatar: (audio: any, nameAudio: string) => Promise<{
        state: boolean;
        url: string;
        err?: any;
    }>;
};
export default _default;
