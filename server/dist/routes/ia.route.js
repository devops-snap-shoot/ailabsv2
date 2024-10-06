"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const ia_controller_1 = (0, tslib_1.__importDefault)(require("@controllers/ia.controller"));
const router = (0, express_1.Router)();
router.post(`/upload_pdf`, ia_controller_1.default.uploadPdf);
router.post(`/chat`, ia_controller_1.default.chat);
router.post(`/delete_pdf`, ia_controller_1.default.deletePdf);
router.post('/upload_pdf_local', ia_controller_1.default.upload_pdf_local);
router.post('/chat_gpt', ia_controller_1.default.chatGPT);
router.post(`/fileToJson`, ia_controller_1.default.fileToJson);
router.post('/gemini-chat', ia_controller_1.default.geminiChat);
router.get('/testUploadFile', ia_controller_1.default.testUploadFile);
router.get('/geminiDeleteFile', ia_controller_1.default.geminiDeleteFile);
router.get('/createIaContext/:userId', ia_controller_1.default.createIaContext);
router.post('/deleteCacheContent', ia_controller_1.default.deleteCacheContent);
router.get('/getCacheList', ia_controller_1.default.getCacheList);
router.get('/deleteAllCacheList', ia_controller_1.default.deleteAllCacheList);
router.get('/getAllMessages/:userId', ia_controller_1.default.getAllMessages);
exports.default = router;
//# sourceMappingURL=ia.route.js.map