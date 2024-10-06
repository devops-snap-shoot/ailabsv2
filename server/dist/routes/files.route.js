"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const env_1 = require("@/configs/env");
const avatares_model_1 = (0, tslib_1.__importDefault)(require("@/models/avatares.model"));
/* import { reviewFileList } from '@/controllers/ia.controller' */
const filesData_model_1 = (0, tslib_1.__importDefault)(require("@/models/filesData.model"));
const filesJobs_model_1 = (0, tslib_1.__importDefault)(require("@/models/filesJobs.model"));
const axios_1 = (0, tslib_1.__importDefault)(require("axios"));
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post(`/getFilesByUserId`, async (req, res) => {
    const { userId } = req.body;
    try {
        const files = await filesData_model_1.default.find({ userId: { $in: [userId] } }).populate('userId');
        res.status(200).json({ state: true, files: files });
    }
    catch (error) {
        res.status(400).json({ state: false, error: error });
    }
});
router.post(`/getFilesByCompany`, async (req, res) => {
    const { companyId } = req.body;
    try {
        const files = await filesData_model_1.default.find({ organization: companyId }).populate('organization');
        console.log('Files_ ', files);
        res.status(200).json({ state: true, files: files });
    }
    catch (error) {
        res.status(400).json({ state: false, error: error });
    }
});
router.get(`/getFileByFileID/:id`, async (req, res) => {
    const { id } = req.params;
    console.log('ID AVATAR', id);
    try {
        const avatar = await avatares_model_1.default.findOne({ idAvatar: id }).populate('doc');
        console.log(avatar);
        res.status(200).json({ state: true, avatar });
    }
    catch (error) {
        res.status(400).json({ state: false, error: error });
    }
});
router.get(`/getFiles`, async (req, res) => {
    try {
        const files = await filesData_model_1.default.find().populate('userId');
        res.status(200).json({ state: true, files: files });
    }
    catch (error) {
        res.status(400).json({ state: false, error: error });
    }
});
router.post('/deleteFile', async (req, res) => {
    const { fileData } = req.body;
    const token = req.headers.authorization;
    const tokenToServer = `${token}${fileData.id}`;
    const client = axios_1.default.create({
        baseURL: env_1.iaUrl,
        timeout: 100000,
        headers: {
            'content-type': 'application/json',
        }
    });
    client.delete(`/api/sessions/${tokenToServer}`)
        .then(async (data) => {
        console.log('response: ', data.data);
        if (data) {
            const files = await filesData_model_1.default.findByIdAndDelete(fileData._id);
            await filesJobs_model_1.default.findOneAndDelete({ idFile: fileData.id });
            res.status(200).json({ state: true, msg: 'deleted' });
        }
    })
        .catch(async (err) => {
        if (err.response && err.response.data) {
            const data = err.response.data;
            if (data.detail === 'Not Found') {
                const files = await filesData_model_1.default.findByIdAndDelete(fileData._id);
                await filesJobs_model_1.default.findOneAndDelete({ idFile: fileData.id });
                res.status(200).json({ state: true, msg: 'deleted' });
            }
        }
        else {
            res.status(400).json(err);
        }
    });
});
router.post(`/updateFileById`, async (req, res) => {
    const { fileData } = req.body;
    const token = req.headers.authorization;
    try {
        const file = await filesData_model_1.default.findByIdAndUpdate(fileData._id, Object.assign(Object.assign({}, fileData), { wait: false }), { new: true });
        if (file) {
            console.log(file);
            const tokenToServer = `${token}${file.id}`;
            const buffer = await axios_1.default.get(file.url, { responseType: 'arraybuffer' });
            const fileChecked = {
                originalname: file.name,
                buffer: buffer.data
            };
            const fileToSend = {
                tokenToServer: tokenToServer,
                file: fileChecked,
                token: token,
                idFile: file.id
            };
            const client = axios_1.default.create({
                baseURL: env_1.iaUrl,
                timeout: 1000000
            });
            client.get(`/api/sessions/`)
                .then(async (data) => {
                console.log(data.data);
                if (data.data.sessions) {
                    const sessions = data.data.sessions;
                    const filterSesion = sessions.filter(x => (x === tokenToServer));
                    let file_ = file;
                    if (filterSesion.length === 0) {
                        res.status(200).json({ state: true, file: file_ });
                        /* reviewFileList(fileToSend) */
                    }
                    else {
                        file_ = await filesData_model_1.default.findByIdAndUpdate(fileData._id, Object.assign(Object.assign({}, fileData), { wait: false }), { new: true });
                        res.status(200).json({ state: true, file: file_ });
                    }
                }
                else {
                    res.status(400).json({ state: false, error: 'Error response ia' });
                }
            })
                .catch((err) => {
                console.log(err);
                res.status(400).json({ state: false, error: err });
            });
        }
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ state: false, error: error });
    }
});
exports.default = router;
//# sourceMappingURL=files.route.js.map