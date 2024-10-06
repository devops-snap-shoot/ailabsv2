"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testConnection = exports.reviewFiles = exports.fileToJson = void 0;
const tslib_1 = require("tslib");
const env_1 = require("@configs/env");
const axios_1 = (0, tslib_1.__importDefault)(require("axios"));
const filesData_model_1 = (0, tslib_1.__importDefault)(require("@/models/filesData.model"));
const socket_controller_1 = require("./socket.controller");
const openai_1 = require("openai");
const fs_1 = (0, tslib_1.__importDefault)(require("fs"));
const filesJobs_model_1 = (0, tslib_1.__importDefault)(require("@/models/filesJobs.model"));
const cron_1 = require("cron");
const pdf_parse_1 = (0, tslib_1.__importDefault)(require("pdf-parse"));
const generative_ai_1 = require("@google/generative-ai");
const server_1 = require("@google/generative-ai/server");
const messages_model_1 = (0, tslib_1.__importDefault)(require("@/models/messages.model"));
const ia_service_1 = require("@/services/ia.service");
const pdf2json_1 = (0, tslib_1.__importDefault)(require("pdf2json"));
const users_model_1 = (0, tslib_1.__importDefault)(require("@/models/users.model"));
const pdfParser = new pdf2json_1.default();
const fileManager = new server_1.GoogleAIFileManager(process.env.GEMINI_API_KEY);
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const cacheManager = new server_1.GoogleAICacheManager(process.env.GEMINI_API_KEY);
let contador = 0;
const fileToJson = async (req, res) => {
    const folder = '/public/';
    try {
        if (req.files) {
            const file = req.files[0];
            console.log(file);
            const fileName = `${Date.now()}`;
            fs_1.default.writeFile(`../files/pdf/${fileName}.pdf`, file.buffer, () => {
                pdfParser.on("pdfParser_dataError", (errData) => console.error(errData));
                pdfParser.on("pdfParser_dataReady", (pdfData) => {
                    fs_1.default.writeFile(`../files/pdf/${fileName}.json`, JSON.stringify(pdfData), (data) => console.log(data));
                    res.status(200).json({ msg: 'ok' });
                });
                pdfParser.loadPDF(`../files/pdf/${fileName}.pdf`);
            });
        }
    }
    catch (err) {
        console.log(err);
    }
};
exports.fileToJson = fileToJson;
const reviewFiles = async () => {
    console.info('Contador: ', contador);
    contador = contador + 1;
    const files = await filesJobs_model_1.default.find({ state: true });
    console.log(files);
    if (files.length > 0) {
        console.info(files.length, ' files to process.');
        sendFileToIAServer(files);
    }
    else {
        console.info(files.length, ' files. No files.');
    }
    const filesJobsComponent = new cron_1.CronJob('*/1 * * * *', async () => {
        console.info('Contador: ', contador + 1);
        contador = contador + 1;
        try {
            const files = await filesJobs_model_1.default.find({ state: true });
            if (files.length > 0) {
                const filesToSend = await Promise.all(files.map(async (file) => {
                    return await filesJobs_model_1.default.findByIdAndUpdate(file._id, { state: false });
                }));
                console.info(filesToSend.length, ' files to process.');
                sendFileToIAServer(filesToSend);
            }
            else {
                console.info(files.length, ' files. No files.');
            }
        }
        catch (error) {
            console.log(error);
        }
    });
    filesJobsComponent.start();
};
exports.reviewFiles = reviewFiles;
const testConnection = async () => {
    const client = axios_1.default.create({
        baseURL: env_1.iaUrl,
        timeout: 2000000,
        headers: {
            'content-type': 'multipart/form-data',
        }
    });
    client.get(`/api/sessions/`).then((data) => {
        const stringData = data.data.sessions;
        console.log(data.data.sessions[0]);
        console.log(data.data.sessions[0].length);
        stringData.forEach((string) => {
            console.log(string.substring(0, data.data.sessions[0].length - 13));
            console.log(string.substring(data.data.sessions[0].length - 13, data.data.sessions[0].length));
        });
        const sessions = data.data.sessions; /* .filter((session: string) => {if (session.includes('undefined')) return session}) */
        sessions.forEach((session) => {
            client.delete(`/api/sessions/${session}`).then((state) => {
                console.log(state.data);
            });
        });
    });
};
exports.testConnection = testConnection;
const geminiDeleteFile = async (req, res) => {
    await fileManager.deleteFile('files/pqophmy0ru9q');
    console.log(`Deleted ${'ERS Journal_B-cells in pulmonary arterial hypertension'}`);
    res.status(200).json({ message: `Deleted ${'ERS Journal_B-cells in pulmonary arterial hypertension'}` });
};
const testUploadFile = async (req, res) => {
    const getResponse = await fileManager.listFiles();
    console.log(getResponse);
    res.status(200).json(getResponse);
};
const uploadPdf = async (req, res) => {
    try {
        const folder = '/public/';
        try {
            if (req.files) {
                const token = req.headers.authorization;
                const file = req.files[0];
                console.log(file);
                const idFile = req.body.idFile;
                const fileName = req.body.fileName;
                const tokenToServer = `${token}${idFile}`;
                fs_1.default.writeFileSync(`../files/pdf/${idFile}.pdf`, file.buffer);
                const urlFile = `${env_1.localServer}${folder}${idFile}.pdf`;
                if (urlFile) {
                    let ocr;
                    const dataBuffer = await axios_1.default.get(urlFile, { responseType: 'arraybuffer' });
                    const data = await (0, pdf_parse_1.default)(dataBuffer.data);
                    console.log('Requiere OCR: ', replaceAll(data.text, /\n/g, '').length);
                    if (replaceAll(data.text, /\n/g, '').length === 0) {
                        ocr = true;
                    }
                    else {
                        ocr = false;
                    }
                    await filesJobs_model_1.default.create({
                        name: fileName,
                        tokenToServer: tokenToServer,
                        urlFile: urlFile,
                        token: token,
                        idFile: idFile,
                        state: true,
                        ocr: ocr
                    });
                    const response = await filesData_model_1.default.create({
                        name: fileName,
                        userId: token,
                        id: idFile,
                        messages: [],
                        url: urlFile,
                        wait: true,
                        state: true,
                        ocr: ocr
                    });
                    res.status(200).json({ data: 'new file added', file: response });
                }
            }
            else {
                console.log('no file');
                res.status(400).json({ message: 'no file' });
            }
        }
        catch (error) {
            console.log('Error PDF: ', error);
            res.status(400).json(error);
        }
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
    /*  */
};
function replaceAll(sentence, regx, replaceBy) {
    return sentence.replace(regx, replaceBy);
}
const sendFileToIAServer = (documentFiles) => {
    const documentFilesCache = [...documentFiles];
    const n = 0;
    geminiFile(n, documentFilesCache);
};
const uploadFileToIAServer = async (n, documentFilesCache) => {
    if (!documentFilesCache[n]) {
        console.log('No mas archivos');
    }
    else {
        const filejob = documentFilesCache[n];
        console.log(filejob);
        const getResponse = await fileManager.getFile('Gemini 1.5 PDF');
        console.log(getResponse);
        /* try {
            const fileResponse = await axios.get(filejob.urlFile, {responseType: 'arraybuffer'})
            const arrayBuffer = await fileResponse.data
            const formData = new FormData()
            formData.append('file', arrayBuffer, `${filejob.idFile}.pdf`)
            const client = axios.create({
                baseURL: iaUrl,
                timeout: 2000000,
                headers: {
                    'content-type': 'multipart/form-data',
                }
            })

            client.post(`/api/sessions/${filejob.tokenToServer}?ocr=${filejob.ocr}`, formData)
            .then(async data => {
                const findFile = await filesDataModel.findOneAndUpdate({name: filejob.name, id: filejob.idFile}, {wait: false}, {new: true})
                if (findFile) {
                    console.log('Ok PDF: ', data.data)
                    console.log(`newPDF${filejob.token}`)
                    s.emit(`newPDF${filejob.token}`, {data: findFile})
                }
                await fileJobsModel.findOneAndUpdate({idFile: filejob.idFile}, {state: false}, {new: true})
                setTimeout(() => {
                    n = n + 1
                    uploadFileToIAServer(n, documentFilesCache)
                }, 500);
            })
            .catch(async err => {
                console.log('Error PDF: ', err.response.data)
                await fileJobsModel.findByIdAndUpdate(filejob._id, {state: true})
                setTimeout(() => {
                    n = n + 1
                    uploadFileToIAServer(n, documentFilesCache)
                }, 500);
            })
        } catch (error) {
            console.log('Error Connect: ', error)
            setTimeout(() => {
                n = n + 1
                uploadFileToIAServer(n, documentFilesCache)
            }, 500);
        } */
    }
};
const chat = async (req, res) => {
    const token = req.headers.authorization;
    const message = req.body.message;
    const idFile = req.body.idFile;
    const tokenToServer = `${token}${idFile}`;
    console.log(tokenToServer, `Quiero que mantengas un rol. Responde este mensaje como si tu nombre fuera Mario: ${message}`);
    try {
        try {
            const client = axios_1.default.create({
                baseURL: env_1.iaUrl,
                timeout: 2000000,
                headers: {
                    'content-type': 'application/json',
                }
            });
            client.post(`/api/chat?session_id=${tokenToServer}&message=${message}`)
                .then(async (data) => {
                if (data) {
                    const audio = await (0, ia_service_1.getAvatarOpenAiAudio)(data.data.answer, Date.now());
                    if (audio.state) {
                        if (data) {
                            res.status(200).json({ data: data.data, urlAudio: audio.url });
                        }
                    }
                    else {
                        res.status(400).json(audio.error);
                    }
                }
            })
                .catch((err) => {
                console.log(err);
                const axiosError = err;
                if (axiosError.response && axiosError.response.status && axiosError.message) {
                    res.status(axiosError.response.status).json({ message: axiosError.message, state: axiosError.response.status });
                }
                else {
                    res.status(400).json(err);
                }
            });
        }
        catch (error) {
            console.log('Error Connect: ', error);
            res.status(500).json(error);
        }
    }
    catch (error) {
        res.status(401).json(error);
    }
};
const deletePdf = (req, res) => {
    const token = req.headers.authorization;
    const idFile = req.body.idFile;
    const nameFile = req.body.nameFile;
    const tokenToServer = `${token}${idFile}`;
    console.log(tokenToServer);
    try {
        const client = axios_1.default.create({
            baseURL: env_1.iaUrl,
            timeout: 2000000,
            headers: {
                'content-type': 'application/json',
            }
        });
        client.delete(`/api/sessions/${tokenToServer}`)
            .then(async (data) => {
            console.log('response: ', data);
            const fileRemoved = await filesData_model_1.default.findOneAndDelete({ id: idFile });
            await filesJobs_model_1.default.findOneAndDelete({ id: idFile });
            console.log('File removed: ', fileRemoved.name);
            if (data) {
                res.status(200).json({ data: data.data });
            }
        })
            .catch(async (err) => {
            var _a;
            console.log(err);
            const fileRemoved = await filesData_model_1.default.findOneAndDelete({ id: idFile });
            await filesJobs_model_1.default.findOneAndDelete({ id: idFile });
            console.log('File removed: ', fileRemoved.name);
            res.status(400).json({ message: err.message, state: (_a = err.response) === null || _a === void 0 ? void 0 : _a.status });
        });
    }
    catch (error) {
        console.log('Error Connect: ', error);
    }
};
const upload_pdf_local = async (req, res) => {
    if (!req.files || req.files.length === 0) {
        res.status(400).json({ msg: 'no document' });
    }
    else {
        console.log(req.files);
        const file = req.files[0];
        fs_1.default.writeFile(`../files/pdf/${file.originalname}`, file.buffer, async (err) => {
            if (err) {
                res.status(400).json({ data: err });
            }
            res.status(200).json({ data: 'PDF Ok' });
        });
    }
};
const chatGPT = async (req, res) => {
    const openai = new openai_1.OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });
    const message = req.body.message;
    const url = req.body.urlDoc;
};
const urlify = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, () => {
        return '';
    });
};
const geminiChat = async (req, res) => {
    const { message, userId, cache } = req.body;
    try {
        /* const getResponse = await fileManager.listFiles();
        console.log(getResponse) */
        const newUserMessage = {
            role: 'user',
            content: message,
            user: userId,
            isAvatarHistory: false,
            cache
        };
        await messages_model_1.default.create(Object.assign({}, newUserMessage));
        const prompt = [
            /* {
                fileData: {
                  mimeType: getResponse.files[0].mimeType,
                  fileUri: getResponse.files[0].uri
                }
            }, */
            { text: message },
        ];
        const genModel = genAI.getGenerativeModelFromCachedContent(cache);
        const result = await genModel.generateContent(prompt);
        console.log(result.response.text());
        let time = 1;
        const interval = setInterval(() => {
            console.log(time);
            socket_controller_1.s.emit(`procesando`, { tiempo: `${time} segundos` });
            time = time + 1;
        }, 1000);
        const text = urlify(result.response.text().replace(/(?<![{[?}\]])\[(?!\s)(.+?)\]/g, '').replace(/(?<![{[?}\]])\((?!\s)(.+?)\)/g, ''));
        const audio = await (0, ia_service_1.getAvatarOpenAiAudio)(text, Date.now());
        if (audio.state) {
            clearInterval(interval);
            const data = {
                answer: result.response.text()
            };
            const newAvatarMessage = {
                role: 'assistant',
                content: result.response.text(),
                user: userId,
                isAvatarHistory: false,
                urlAudio: audio.url,
                cache
            };
            await messages_model_1.default.create(Object.assign({}, newAvatarMessage));
            res.status(200).json({ state: true, data, urlAudio: audio.url, cache });
        }
        else {
            clearInterval(interval);
            res.status(400).json(audio);
        }
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ state: false, error });
    }
};
const deleteCacheContent = async (req, res) => {
    const { cacheName } = req.body;
    await cacheManager.delete(cacheName);
    res.status(200).json({ message: `${cacheName} deleted` });
};
const getCacheList = async (req, res) => {
    try {
        const listResult = await cacheManager.list();
        console.log(listResult);
        if (listResult) {
            if (listResult.cachedContents)
                listResult.cachedContents.forEach((cache) => {
                    console.log(cache);
                });
        }
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ error });
    }
};
const deleteAllCacheList = async (req, res) => {
    try {
        const listResult = await cacheManager.list();
        listResult.cachedContents.forEach(async (cache) => {
            console.log(cache);
            await cacheManager.delete(cache.name);
        });
        res.status(200).json({ message: 'All deleted' });
    }
    catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
};
const createIaContext = async (req, res) => {
    const { userId } = req.params;
    newContextData(userId, res);
};
const getAllMessages = async (req, res) => {
    const { userId } = req.params;
    console.log(userId);
    try {
        const messages = await messages_model_1.default.find({ user: userId }).populate('user');
        if (messages.length === 0) {
            newContextData(userId, res);
        }
        else {
            res.status(200).json({ messages });
        }
    }
    catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
};
const newContextData = async (userId, res) => {
    console.log(userId);
    try {
        const displayName = 'Mario Cañete';
        const modelState = 'models/gemini-1.5-flash-001';
        const user = await users_model_1.default.findById(userId).populate('userOtherData');
        const userOtherData = user.userOtherData;
        const userListData = `Nombre: ${user.name} ${user.lastName}
        Género: ${user.gender}
        Nacionalidad: ${user.nacionality}
        Ciudad: ${user.city}
        Mis gustos son:
        - Montaña: ${userOtherData.tastes.montain ? 'si' : 'no'}
        - Mar: ${userOtherData.tastes.sea ? 'si' : 'no'}
        - Pasatiempo: ${userOtherData.tastes.hobbie}
        - Tendencia política: ${userOtherData.tastes.politicalTrend}
        - Apatiencia personal: ${userOtherData.tastes.personalAppearance}
        - Contextura física: ${userOtherData.tastes.physicalBuild}
        - Mascotas: ${userOtherData.tastes.pet}
        - Estado civil: ${userOtherData.tastes.maritalStatus}
        - Preferencia gastronómica o de comidas: ${userOtherData.tastes.foods}
        - Gustos musicales: ${userOtherData.tastes.music}
        - Estrato social: ${userOtherData.tastes.socialStratum}
        - Perfil social: ${userOtherData.tastes.socialProfile}
        - Me gusta coleccionar sobre:
        ${userOtherData.tastes.collectibles.map(collectible => {
            return `- ${collectible} `;
        })}
        Me gradué en ${userOtherData.graduationUniversity}
        Trabajo en las siguientes instituciones: 
        ${userOtherData.institutions.map((institution) => {
            return `- ${institution}`;
        })}
        Trabajo en el sector ${userOtherData.sector}
        Mi método de trabajo se compone de lo siguiente:
        Fonasa: ${userOtherData.workData.healthForecast.fonasa ? 'si' : 'no'}
        Banmédica: ${userOtherData.workData.healthForecast.banmedica ? 'si' : 'no'}
        Cruz Blanca: ${userOtherData.workData.healthForecast.cruzBlanca ? 'si' : 'no'}
        Consalud: ${userOtherData.workData.healthForecast.consalud ? 'si' : 'no'}
        Vida Tres: ${userOtherData.workData.healthForecast.vidaTres ? 'si' : 'no'}
        Nueva Más Vida: ${userOtherData.workData.healthForecast.nuevaMasVida ? 'si' : 'no'}
        Telemedicina: ${userOtherData.workData.telemedicine ? 'si' : 'no'}
        Kardex: ${userOtherData.workData.kardex}`;
        const systemInstruction = `Yo soy ${user.name} ${user.lastName}. Tu eres Mario Cañete, un visitador médico que trabaja para la empresa 
        farmacéutica MegaLabs.
        Tu cartera de clientes está compuesta por doctores de diversas especialidades.
        Tu rol es promover y vender los productos farmacéuticos de tu empresa,
        estableciendo relaciones sólidas y de confianza con los médicos para fomentar la prescripción de tus productos.
        Adaptas tu tono de comunicación al estilo preferido del doctor, 
        ya sea formal o informal. Genera una relación cercana y de confianza conmigo en base a los siguientes datos:
        ${userListData}
        Haz que las conversaciones conmigo sean útiles y amenas, 
        siempre brindando información médica precisa mientras fortaleces el vínculo personal.
        Tus respuestas deben ser preferentemente en español.`;
        const getResponse = await fileManager.listFiles();
        console.log(getResponse);
        const prompt = [
            {
                fileData: {
                    mimeType: getResponse.files[0].mimeType,
                    fileUri: getResponse.files[0].uri
                }
            }
        ];
        const cache = await cacheManager.create({
            model: modelState,
            displayName,
            systemInstruction: {
                parts: [
                    {
                        text: systemInstruction
                    }
                ],
                role: 'user'
            },
            contents: [
                {
                    role: 'user',
                    parts: prompt
                },
            ]
        });
        console.log(cache);
        const genModel = genAI.getGenerativeModelFromCachedContent(cache);
        const result = await genModel.generateContent({
            contents: [
                {
                    role: 'user',
                    parts: [
                        {
                            text: 'Hola Mario. Dame un saludo de inicio porque es la primera vez que inicio sesión y que tenga relación con mis datos personales. También presentate y dime el nombre del documento que se te ha proporcionado.',
                        },
                    ],
                },
            ],
        });
        const text = urlify(result.response.text().replace(/(?<![{[?}\]])\[(?!\s)(.+?)\]/g, '').replace(/(?<![{[?}\]])\((?!\s)(.+?)\)/g, ''));
        const audio = await (0, ia_service_1.getAvatarOpenAiAudio)(text, Date.now());
        let time = 1;
        const interval = setInterval(() => {
            console.log(time);
            socket_controller_1.s.emit(`procesando`, { tiempo: `${time} segundos` });
            time = time + 1;
        }, 1000);
        if (audio.state) {
            clearInterval(interval);
            const data = {
                answer: result.response.text()
            };
            const newAvatarMessage = {
                role: 'assistant',
                content: result.response.text(),
                user: userId,
                isAvatarHistory: false,
                urlAudio: audio.url,
                cache
            };
            const response = await messages_model_1.default.create(Object.assign({}, newAvatarMessage));
            res.status(200).json({ state: true, messages: [response] });
        }
        else {
            clearInterval(interval);
            res.status(400).json(audio);
        }
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ state: false, error });
    }
};
const geminiFile = async (n, documentFilesCache) => {
    if (!documentFilesCache[n]) {
        console.log('No mas archivos');
    }
    else {
        const filejob = documentFilesCache[n];
        console.log(filejob);
        try {
            const uploadResponse = await fileManager.uploadFile(`../files/pdf/${filejob.idFile}.pdf`, {
                mimeType: "application/pdf",
                displayName: filejob.name,
            });
            console.log(`Uploaded file ${uploadResponse.file.displayName} as: ${uploadResponse.file.uri}`);
            const findFile = await filesData_model_1.default.findOneAndUpdate({ name: filejob.name, id: filejob.idFile }, { wait: false }, { new: true });
            if (findFile) {
                console.log('Ok PDF: ', uploadResponse.file.displayName);
                socket_controller_1.s.emit(`newPDF${filejob.token}`, { data: findFile });
            }
            await filesJobs_model_1.default.findOneAndUpdate({ idFile: filejob.idFile }, { state: false }, { new: true });
            geminiFile(n + 1, documentFilesCache);
        }
        catch (error) {
            console.log('Error Connect: ', error);
            setTimeout(() => {
                n = n + 1;
                geminiFile(n, documentFilesCache);
            }, 500);
        }
    }
};
exports.default = {
    uploadPdf,
    chat,
    deletePdf,
    upload_pdf_local,
    chatGPT,
    fileToJson: exports.fileToJson,
    geminiChat,
    geminiFile,
    testUploadFile,
    geminiDeleteFile,
    createIaContext,
    deleteCacheContent,
    getCacheList,
    deleteAllCacheList,
    getAllMessages
};
//# sourceMappingURL=ia.controller.js.map