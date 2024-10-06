export declare const getAvatarOpenAiAudio: (message: string, id: number) => Promise<{
    state: boolean;
    url: string;
    error?: undefined;
} | {
    state: boolean;
    error: any;
    url?: undefined;
}>;
