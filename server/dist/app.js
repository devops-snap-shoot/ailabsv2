"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const compression_1 = (0, tslib_1.__importDefault)(require("compression"));
const cookie_parser_1 = (0, tslib_1.__importDefault)(require("cookie-parser"));
const cors_1 = (0, tslib_1.__importDefault)(require("cors"));
const configs_1 = (0, tslib_1.__importDefault)(require("./configs"));
const express_1 = (0, tslib_1.__importDefault)(require("express"));
const helmet_1 = (0, tslib_1.__importDefault)(require("helmet"));
const hpp_1 = (0, tslib_1.__importDefault)(require("hpp"));
const morgan_1 = (0, tslib_1.__importDefault)(require("morgan"));
const mongoose_1 = require("mongoose");
const swagger_jsdoc_1 = (0, tslib_1.__importDefault)(require("swagger-jsdoc"));
const swagger_ui_express_1 = (0, tslib_1.__importDefault)(require("swagger-ui-express"));
const _databases_1 = require("@databases");
const error_middleware_1 = (0, tslib_1.__importDefault)(require("@middlewares/error.middleware"));
const logger_1 = require("@utils/logger");
const i18n_1 = (0, tslib_1.__importDefault)(require("i18n"));
const path_1 = (0, tslib_1.__importDefault)(require("path"));
const multer_1 = (0, tslib_1.__importDefault)(require("multer"));
const index_route_1 = (0, tslib_1.__importDefault)(require("./routes/index.route"));
const socket_controller_1 = require("./controllers/socket.controller");
const ia_controller_1 = require("./controllers/ia.controller");
const mysql_1 = (0, tslib_1.__importDefault)(require("mysql"));
const cron_1 = require("cron");
const users_model_1 = (0, tslib_1.__importDefault)(require("./models/users.model"));
/* import pediatras from '../../files/pediatras.json' */
const userOtherData_model_1 = (0, tslib_1.__importDefault)(require("./models/userOtherData.model"));
const specialty_model_1 = (0, tslib_1.__importDefault)(require("./models/specialty.model"));
const env_1 = require("./configs/env");
process.env.SUPPRESS_NO_CONFIG_WARNING = 'true';
const app = (0, express_1.default)();
const env = configs_1.default.env.environment;
const port = (env === 'production') ? configs_1.default.env.port : configs_1.default.env.portDev;
console.log(port);
const locale = configs_1.default.env.locale;
let numberLenghtUser = 0;
const connectToDatabase = () => {
    try {
        /* testConnection() */
        (0, ia_controller_1.reviewFiles)();
    }
    catch (error) {
        console.log(error);
    }
    if (env !== 'production') {
        (0, mongoose_1.set)('debug', false);
    }
    else {
        (0, mongoose_1.set)('debug', true);
        /* connectMySQL() */
    }
    console.log('????????Conectando a: ', _databases_1.dbConnection.url);
    (0, mongoose_1.connect)(_databases_1.dbConnection.url);
    try {
        console.log('#######Conectado a: ', _databases_1.dbConnection.url);
    }
    catch (err) {
        console.log('cwerfvcwcwcwecsevcev ', err);
    }
};
const uploadUsers = async () => {
    /* const users: any = pediatras */
    /* console.log(users[0]) */
    /* uploadUsersOneByOne(users, 0) */
};
const uploadUsersOneByOne = async (users, index) => {
    if (!users[index]) {
        console.log('Usuarios cargados');
    }
    else {
        try {
            const userData = users[index];
            if (userData.Email && userData.Email.includes('@')) {
                const findUser = await users_model_1.default.findOne({ email: userData.Email.toLowerCase() });
                if (!findUser) {
                    const specialityUser = userData.Especialidad;
                    let speciality;
                    const findSpeciality = await specialty_model_1.default.findOne({ name: specialityUser.toLowerCase() });
                    if (!findSpeciality) {
                        const newSpeciality = await specialty_model_1.default.create({
                            name: specialityUser.toLowerCase(),
                            organization: '652934c5aaf7a00a88749e47',
                            specialityMather: userData['Especialidad madre'].toLowerCase()
                        });
                        speciality = newSpeciality;
                    }
                    else {
                        speciality = findSpeciality;
                    }
                    const newUser = {
                        name: userData.Nombre,
                        lastName: '',
                        birthdate: new Date(userData.Fecha_de_nacimiento.replace(/(\d\d)\/(\d\d)\/(\d{4})/, "$3-$1-$2")).toISOString(),
                        gender: userData.Genero,
                        nacionality: userData.Nacionalidad,
                        city: userData.Comuna,
                        email: userData.Email.toLowerCase(),
                        passwordProvisory: Date.now().toString(),
                        organization: ['652934c5aaf7a00a88749e47'],
                        roles: ['662bcf05e28f5a38cdf57a8b'],
                        speciality: [speciality._id]
                    };
                    const newUserOther = {
                        institutions: [userData.Institucion],
                        sector: userData.Sector,
                        graduationUniversity: userData.Ues_Egreso,
                        tastes: {
                            montain: userData.Montaña === 'Si' ? true : false,
                            sea: userData.Mar === 'Si' ? true : false,
                            hobbie: userData.Hobbie,
                            collectibles: [userData.C_Obj_Coleccion],
                            politicalTrend: userData['Tendencia Politica'],
                            personalAppearance: userData['Aspecto personal'],
                            physicalBuild: userData['Contextura física'],
                            pet: userData.Mascota,
                            maritalStatus: userData['Estado civil'],
                            foods: userData.Comida,
                            music: userData.Musica,
                            socialStratum: userData.Estrato_Social,
                            socialProfile: userData['Perfil Social']
                        },
                        workData: {
                            telemedicine: userData.Telemedicina === 'Si' ? true : false,
                            healthForecast: {
                                fonasa: userData.Fonasa === 'Si' ? true : false,
                                banmedica: userData['isapres banmedica'] === 'Si' ? true : false,
                                cruzBlanca: userData['Isapre cruz blanca'] === 'Si' ? true : false,
                                consalud: userData['Isapre consalud'] === 'Si' ? true : false,
                                vidaTres: userData['Isapre vida tres'] === 'Si' ? true : false,
                                nuevaMasVida: userData['isapre nueva mas vida'] === 'Si' ? true : false
                            },
                            kardex: userData.Kardex
                        }
                    };
                    console.log('Cargando Datos extras de: ', newUser.name, `${index + 1}/${users.length}`);
                    const newData = await userOtherData_model_1.default.create(newUserOther);
                    newUser.userOtherData = {
                        institutions: [userData.Institucion],
                        sector: userData.Sector,
                        graduationUniversity: userData.Ues_Egreso,
                        tastes: {
                            montain: userData.Montaña === 'Si' ? true : false,
                            sea: userData.Mar === 'Si' ? true : false,
                            hobbie: userData.Hobbie,
                            collectibles: [userData.C_Obj_Coleccion],
                            politicalTrend: userData['Tendencia Politica'],
                            personalAppearance: userData['Aspecto personal'],
                            physicalBuild: userData['Contextura física'],
                            pet: userData.Mascota,
                            maritalStatus: userData['Estado civil'],
                            foods: userData.Comida,
                            music: userData.Musica,
                            socialStratum: userData.Estrato_Social,
                            socialProfile: userData['Perfil Social']
                        },
                        workData: {
                            telemedicine: userData.Telemedicina === 'Si' ? true : false,
                            healthForecast: {
                                fonasa: userData.Fonasa === 'Si' ? true : false,
                                banmedica: userData['isapres banmedica'] === 'Si' ? true : false,
                                cruzBlanca: userData['Isapre cruz blanca'] === 'Si' ? true : false,
                                consalud: userData['Isapre consalud'] === 'Si' ? true : false,
                                vidaTres: userData['Isapre vida tres'] === 'Si' ? true : false,
                                nuevaMasVida: userData['isapre nueva mas vida'] === 'Si' ? true : false
                            },
                            kardex: userData.Kardex
                        },
                    },
                        console.log('Cargando usuario: ', newUser.name);
                    await users_model_1.default.create(newUser);
                }
                else {
                    console.error('User ', userData.Nombre, ' ya existe');
                }
            }
            else {
                console.error('User ', userData.Nombre, ' sin correo o inválido');
            }
            index = index + 1;
            uploadUsersOneByOne(users, index);
        }
        catch (error) {
            console.log(error);
        }
    }
};
const connectMySQL = () => {
    let minuto = 0;
    const minutesCounter = new cron_1.CronJob('*/1 * * * *', () => {
        minuto = minuto + 1;
        console.log('Contador de minutos: ', minuto);
    });
    minutesCounter.start();
    //'*/5 * * * *'
    const job = new cron_1.CronJob('*/5 * * * *', () => {
        console.log('Starting CRON Job');
        const con = mysql_1.default.createConnection({
            host: "162.241.224.107",
            user: "imkchatc_Intermediary",
            password: "ImKChat1234!!",
            database: "imkchatc_payment_processed"
        });
        con.connect((err) => {
            if (err) {
                console.info(err);
            }
            con.query("SELECT * FROM Integracion_Stripe_Compra_Efectiva_ImKchat", (error, result, fields) => {
                if (error) {
                    console.info(error);
                }
                const response = Array.from(result);
                console.log(response.length, numberLenghtUser);
                response.forEach(async (el, i) => {
                    if (i >= numberLenghtUser) {
                        console.log(el.client_name.split(' '));
                        const newUser = {
                            name: el.client_name.split(' ')[0],
                            lastName: el.client_name.split(' ')[1],
                            email: el.client_email,
                            product_name: el.product_name,
                            product_id: el.product_id,
                            product_type: el.product_type,
                            totalDocsByMonth: el.document_monthy_limit,
                            payment_status: el.payment_status
                        };
                        const findUser = await users_model_1.default.findOne({ email: newUser.email });
                        if (!findUser) {
                            console.log('Usuario no encontrado');
                        }
                    }
                });
                numberLenghtUser = response.length;
                con.end((err) => {
                    if (err) {
                        console.info(err);
                    }
                });
            });
        });
    });
    job.start();
};
const initializeMiddlewares = () => {
    if (env === 'development') {
        app.use((0, morgan_1.default)(configs_1.default.log.format, { stream: logger_1.stream }));
    }
    /* console.log(config.env.storageApi.url) */
    /* app.use(cors({ origin: config.cors.origin, credentials: config.cors.credentials,  optionsSuccessStatus: 200})) */
    /* const allowedOrigins = ['http://megalabs.imkchat.com', 'http://localhost:8100', 'https://imkchat.blob.core.windows.net']; */
    /* const corsOptions: CorsOptions = {}
    corsOptions.origin = (origin, callback) => {
        if (!allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
    }; */
    /* app.use((req, res, next) => {
        res.setHeader(
          'Content-Security-Policy',
          "default-src 'self' https://www.botlibre.com/media/a13974724-0.webm; font-src 'self'; img-src 'self'; script-src 'self'; style-src 'self'; frame-src 'self'"
        );
        next();
    }); */
    /* app.use(cors({
        methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH'],
        optionsSuccessStatus: 200
    })) */
    app.use((0, cors_1.default)({ origin: configs_1.default.cors.origin, credentials: configs_1.default.cors.credentials }));
    app.use((0, hpp_1.default)());
    app.use((0, compression_1.default)());
    app.use((0, multer_1.default)().any());
    app.use(express_1.default.json({ limit: '50mb' }));
    /* app.use(express.urlencoded({limit: '50mb'})) */
    app.use((0, cookie_parser_1.default)());
    configureI18n();
    app.use(i18n_1.default.init);
    app.use(express_1.default.urlencoded({ extended: true, limit: '50mb' }));
    app.use((0, helmet_1.default)());
    app.use(helmet_1.default.contentSecurityPolicy({
        directives: {
            connectSrc: [
                "'self'",
                'data:',
                'https:',
                'blob:',
                configs_1.default.env.storageApi.url
            ],
            defaultSrc: [
                "'self'",
                'data:',
                'blob:',
                "'unsafe-inline'",
                "'unsafe-eval'",
                'content:',
                'gap:',
                configs_1.default.env.storageApi.url
            ],
            fontSrc: [
                "'self'",
                'blob:',
                'fonts.gstatic.com',
                'data:'
            ],
            imgSrc: [
                "'self'",
                'data:',
                'blob:',
                'https:',
                configs_1.default.env.storageApi.url
            ],
            mediaSrc: [
                "'self'",
                'data:',
                'blob:',
                'https:',
                'https://www.botlibre.com'
            ],
            workerSrc: [
                "'self'",
                'data:',
                'blob:',
                configs_1.default.env.storageApi.url
            ],
            childSrc: [
                "'self'",
                'data:',
                'blob:',
                configs_1.default.env.storageApi.url
            ],
            objectSrc: [
                "'self'",
                'blob:',
                'data:',
                configs_1.default.env.storageApi.url
            ],
            styleSrc: [
                "'self'",
                'blob:',
                "'unsafe-inline'",
                'fonts.googleapis.com'
            ],
            scriptSrc: [
                "'self'",
                'blob:',
                "'unsafe-inline'",
                "'unsafe-eval'",
                configs_1.default.env.storageApi.url
            ],
        }
    }));
    app.use((req, res, next) => {
        res.setHeader('Permissions-Policy', 'geolocation=()');
        next();
    });
    console.log(path_1.default.join(__dirname, (env_1.onMachine === 'YES') ? '../../../TTS/output' : '../../files/wav'));
    initializeRoutes();
    app.use(express_1.default.static(path_1.default.resolve(__dirname, "../../client/build")));
    app.use("/public", express_1.default.static(path_1.default.join(__dirname, '../../files/pdf')));
    app.use("/python", express_1.default.static(path_1.default.join(__dirname, (env_1.onMachine === 'YES') ? '../../../TTS/samples' : '../../files/python')));
    app.use("/wav", express_1.default.static(path_1.default.join(__dirname, (env_1.onMachine === 'YES') ? '../../files/wav' : '../../files/wav')));
    app.get('/*', (req, res) => {
        res.sendFile(path_1.default.resolve(__dirname, "../../client/build", "index.html"));
    });
};
const initializeRoutes = () => {
    app.use('/', index_route_1.default);
};
const initializeSwagger = () => {
    const options = {
        swaggerDefinition: {
            info: {
                title: 'REST API',
                version: '1.0.0',
                description: 'Example docs'
            }
        },
        apis: ['swagger.yaml']
    };
    const specs = (0, swagger_jsdoc_1.default)(options);
    app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs));
};
const initializeErrorHandling = () => {
    app.use(error_middleware_1.default);
};
const configureI18n = () => {
    i18n_1.default.configure({
        directory: __dirname + '/locales',
        defaultLocale: locale,
        queryParameter: 'language',
        cookie: 'language',
        register: global
    });
};
const App = () => {
    try {
        const server = app.listen(port, () => {
            logger_1.logger.info(`=================================`);
            logger_1.logger.info(`======= ENV: ${env} =======`);
            logger_1.logger.info(`🚀 App listening on the port ${port}`);
            logger_1.logger.info(`=================================`);
        });
        (0, socket_controller_1.SocketController)(server);
        connectToDatabase();
        initializeMiddlewares();
        initializeSwagger();
        initializeErrorHandling();
    }
    catch (error) {
        console.log(error);
    }
};
exports.default = App;
//# sourceMappingURL=app.js.map