import OpenAI from "openai";
import azureStorageService from "./azure-storage.service";

export const getAvatarOpenAiAudio = async (message: string, id: number) => {
    try {
        const openai = new OpenAI(
            {
                apiKey: process.env.OPENAI_API_KEY
            }
        );
        const mp3 = await openai.audio.speech.create({
            model: "tts-1",
            voice: "onyx",
            input: message,
          });
        const buffer = Buffer.from(await mp3.arrayBuffer());
        const response = await azureStorageService.uploadAudioAvatar({buffer: buffer}, `${id}.mp3`)
        return ({
            state: true,
            url: response.url
        })
    } catch (error) {
        return ({
            state: false,
            error: error
        })
    }
    
}