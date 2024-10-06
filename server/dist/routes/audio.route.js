"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const elevenlabs_1 = require("elevenlabs");
const fs_1 = require("fs");
const router = (0, express_1.Router)();
router.get('/text-to-speech', async (req, res) => {
    const { text } = req.query;
    const newText = text;
    const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
    const client = new elevenlabs_1.ElevenLabsClient({
        apiKey: ELEVENLABS_API_KEY,
    });
    try {
        const audio = await client.generate({
            voice: "Rachel",
            model_id: "eleven_turbo_v2_5",
            text: newText,
        });
        const fileDate = Date.now();
        const fileName = `${fileDate}.mp3`;
        const fileStream = (0, fs_1.createWriteStream)(fileName);
        audio.pipe(fileStream);
        /* fileStream.on("finish", () => resolve(fileName)); // Resolve with the fileName
        fileStream.on("error", reject); */
    }
    catch (error) {
        res.status(400).json({ error: error });
    }
});
exports.default = router;
//# sourceMappingURL=audio.route.js.map