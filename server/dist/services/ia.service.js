"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvatarOpenAiAudio = void 0;
const tslib_1 = require("tslib");
const openai_1 = (0, tslib_1.__importDefault)(require("openai"));
const azure_storage_service_1 = (0, tslib_1.__importDefault)(require("./azure-storage.service"));
const getAvatarOpenAiAudio = async (message, id) => {
    try {
        const openai = new openai_1.default({
            apiKey: process.env.OPENAI_API_KEY
        });
        const mp3 = await openai.audio.speech.create({
            model: "tts-1",
            voice: "onyx",
            input: message,
        });
        const buffer = Buffer.from(await mp3.arrayBuffer());
        const response = await azure_storage_service_1.default.uploadAudioAvatar({ buffer: buffer }, `${id}.mp3`);
        return ({
            state: true,
            url: response.url
        });
    }
    catch (error) {
        return ({
            state: false,
            error: error
        });
    }
};
exports.getAvatarOpenAiAudio = getAvatarOpenAiAudio;
//# sourceMappingURL=ia.service.js.map