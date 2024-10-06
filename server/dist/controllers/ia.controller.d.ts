/// <reference types="qs" />
import { Request, Response } from 'express';
interface CustomRequest extends Request {
    files?: any;
}
export declare const fileToJson: (req: CustomRequest, res: Response) => Promise<void>;
export declare const reviewFiles: () => Promise<void>;
export declare const testConnection: () => Promise<void>;
declare const _default: {
    uploadPdf: (req: CustomRequest, res: Response<any, Record<string, any>>) => Promise<void>;
    chat: (req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<void>;
    deletePdf: (req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => void;
    upload_pdf_local: (req: CustomRequest, res: Response<any, Record<string, any>>) => Promise<void>;
    chatGPT: (req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<void>;
    fileToJson: (req: CustomRequest, res: Response<any, Record<string, any>>) => Promise<void>;
    geminiChat: (req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<void>;
    geminiFile: (n: number, documentFilesCache: {
        _id: string;
        name: string;
        tokenToServer: string;
        urlFile: string;
        token: string;
        idFile: number;
        state: boolean;
        ocr: boolean;
    }[]) => Promise<void>;
    testUploadFile: (req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<void>;
    geminiDeleteFile: (req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<void>;
    createIaContext: (req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<void>;
    deleteCacheContent: (req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<void>;
    getCacheList: (req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<void>;
    deleteAllCacheList: (req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<void>;
    getAllMessages: (req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<void>;
};
export default _default;
