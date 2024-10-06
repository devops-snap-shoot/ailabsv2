import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import config from './configs'
import express from 'express'
import helmet from 'helmet'
import hpp from 'hpp'
import morgan from 'morgan'
import { connect, set } from 'mongoose'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { dbConnection } from '@databases'
import errorMiddleware from '@middlewares/error.middleware'
import { logger, stream } from '@utils/logger'
import i18n from 'i18n'
import path from 'path'
import { Request, Response } from 'express'
import multer from 'multer'
import router from './routes/index.route'
import {SocketController} from './controllers/socket.controller'
import { testConnection, reviewFiles } from './controllers/ia.controller'
import mysql from 'mysql'
import { CronJob } from 'cron'
import { User, UserOtherDate } from './interfaces/users.interface'
import userModel from './models/users.model'
/* import pediatras from '../../files/pediatras.json' */
import userOtherDataModel from './models/userOtherData.model'
import specialityModel from './models/specialty.model'
import { onMachine } from './configs/env'

process.env.SUPPRESS_NO_CONFIG_WARNING = 'true'
const app: express.Application = express()
const env: string = config.env.environment
const port = (env === 'production') ? config.env.port : config.env.portDev
console.log(port)
const locale: string = config.env.locale

let numberLenghtUser = 0

const connectToDatabase = () => {
    try {
        /* testConnection() */
        reviewFiles()
    } catch (error) {
        console.log(error)
    }
    if (env !== 'production') {
        set('debug', false)
    } else {
        set('debug', true)
        /* connectMySQL() */
    }
    console.log('????????Conectando a: ', dbConnection.url)

    connect(dbConnection.url); 
   
    try{
            console.log('#######Conectado a: ', dbConnection.url)
        } catch (err) {
            console.log('cwerfvcwcwcwecsevcev ', err)
        }
    }


const uploadUsers = async () => {
    /* const users: any = pediatras */
    /* console.log(users[0]) */

    /* uploadUsersOneByOne(users, 0) */
}

interface UserExcel {
    Nombre: string
    Kardex: string
    Fecha_de_nacimiento: string
    Edad: number,
    Rango_Edad: string
    Genero: string
    Nacionalidad: string
    Especialidad: string
    'Especialidad madre': string
    Institucion: string
    Sector: string
    Comuna: string
    R: string
    Email: string
    Ues_Egreso: string
    Tipo_U: string
    'Montaña': string
    Mar: string
    Hobbie: string
    C_Obj_Coleccion: string
    'Tendencia Politica': string
    'Aspecto personal': string
    'Contextura física': string
    Mascota: string
    'Estado civil': string
    Comida: string
    Musica: string
    Estrato_Social: string
    'Perfil Social': string
    Telemedicina: string
    Fonasa: string
    'isapres banmedica': string
    'Isapre cruz blanca': string
    'Isapre colmena': string
    'Isapre consalud': string
    'Isapre vida tres': string
    'isapre nueva mas vida': string
}

const uploadUsersOneByOne = async (users: any[], index: number) => {
    if (!users[index]) {
        console.log('Usuarios cargados')
    } else {
        try {
            const userData: UserExcel = users[index]

            if (userData.Email && userData.Email.includes('@')) {

                const findUser = await userModel.findOne({email: userData.Email.toLowerCase()})

                if (!findUser) {
                    const specialityUser = userData.Especialidad

                    let speciality: any
        
                    const findSpeciality = await specialityModel.findOne({name: specialityUser.toLowerCase()})
        
                    if (!findSpeciality) {
                        const newSpeciality = await specialityModel.create({
                            name: specialityUser.toLowerCase(),
                            organization: '652934c5aaf7a00a88749e47',
                            specialityMather: userData['Especialidad madre'].toLowerCase()
                        })
                        speciality = newSpeciality
                    } else {
                        speciality = findSpeciality
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
                    } as User
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
                        workData : {
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
                    } as UserOtherDate
                    console.log('Cargando Datos extras de: ', newUser.name, `${index + 1}/${users.length}`)
        
                    const newData = await userOtherDataModel.create(newUserOther)
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
                        workData : {
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
                    console.log('Cargando usuario: ', newUser.name)
                    await userModel.create(newUser)
    
                } else {
                    console.error('User ', userData.Nombre, ' ya existe')
                }

            } else {
                console.error('User ', userData.Nombre, ' sin correo o inválido')
            }
            index = index + 1
            uploadUsersOneByOne(users, index)
        } catch (error) {
            console.log(error)
        }
    }
}

const connectMySQL = () => {
    let minuto = 0

    const minutesCounter = new CronJob('*/1 * * * *', () => {
        minuto = minuto + 1
        console.log('Contador de minutos: ', minuto)
    })

    minutesCounter.start()
    //'*/5 * * * *'
    const job = new CronJob('*/5 * * * *', () => {
        console.log('Starting CRON Job')
        const con = mysql.createConnection({
            host: "162.241.224.107",
            user: "imkchatc_Intermediary",
            password: "ImKChat1234!!",
            database: "imkchatc_payment_processed"
        })
        con.connect((err) => {
            if (err) {
                console.info(err)
            }
            con.query("SELECT * FROM Integracion_Stripe_Compra_Efectiva_ImKchat", (error, result, fields) => {
                if (error) {
                    console.info(error)
                }
                const response = Array.from(result)
                console.log(response.length, numberLenghtUser)
                response.forEach(async (el: any, i: number) => {
                    if (i >= numberLenghtUser) {
                        console.log(el.client_name.split(' '))
                        const newUser = {
                            name: el.client_name.split(' ')[0],
                            lastName: el.client_name.split(' ')[1],
                            email: el.client_email,
                            product_name: el.product_name,
                            product_id: el.product_id,
                            product_type: el.product_type,
                            totalDocsByMonth: el.document_monthy_limit,
                            payment_status: el.payment_status
                        } as User
                        const findUser = await userModel.findOne({email: newUser.email})
                        if (!findUser) {
                            console.log('Usuario no encontrado')
                        }
                    }
                })
                numberLenghtUser = response.length
                con.end((err) => {
                    if (err) {
                        console.info(err)
                    }
                })
            })
        })
    })
    job.start()
}

const initializeMiddlewares = () => {
    if (env === 'development') {
        app.use(morgan(config.log.format, { stream }))
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
    app.use(cors({ origin: config.cors.origin, credentials: config.cors.credentials }))
    app.use(hpp())
    app.use(compression())
    app.use(multer().any())
    app.use(express.json({limit: '50mb'}))
    /* app.use(express.urlencoded({limit: '50mb'})) */
    app.use(cookieParser())
    configureI18n()
    app.use(i18n.init)
    app.use(express.urlencoded({ extended: true, limit: '50mb' }))
    app.use(helmet())
    app.use(helmet.contentSecurityPolicy({
        directives: {
            connectSrc: [
                "'self'",
                'data:',
                'https:',
                'blob:',
                config.env.storageApi.url
            ],
            defaultSrc: [
                "'self'",
                'data:',
                'blob:',
                "'unsafe-inline'",
                "'unsafe-eval'",
                'content:',
                'gap:',
                config.env.storageApi.url
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
                config.env.storageApi.url
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
                config.env.storageApi.url
            ],
            childSrc: [
                "'self'",
                'data:',
                'blob:',
                config.env.storageApi.url
            ],
            objectSrc: [
                "'self'",
                'blob:',
                'data:',
                config.env.storageApi.url
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
                config.env.storageApi.url
            ],
            
        }
    }))
    
    app.use((req, res, next) => {
        res.setHeader(
            'Permissions-Policy',
            'geolocation=()'
        )
        next()
    })

    console.log(path.join(__dirname, (onMachine==='YES') ? '../../../TTS/output' : '../../files/wav'))
    initializeRoutes()
    app.use(express.static(path.resolve(__dirname, "../../client/build")))
    app.use("/public", express.static(path.join(__dirname, '../../files/pdf')))
    app.use("/python", express.static(path.join(__dirname, (onMachine==='YES') ? '../../../TTS/samples' : '../../files/python')))
    app.use("/wav", express.static(path.join(__dirname, (onMachine==='YES') ? '../../files/wav' : '../../files/wav')))
    app.get('/*', (req: Request, res: Response) => {
        res.sendFile(path.resolve(__dirname, "../../client/build", "index.html"))
    })
}

const initializeRoutes = () => {
    app.use('/', router)
}

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
    }

    const specs = swaggerJSDoc(options)
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))
}

const initializeErrorHandling = () => {
    app.use(errorMiddleware)
}

const configureI18n = () => {
    i18n.configure({
        directory: __dirname + '/locales',
        defaultLocale: locale,
        queryParameter: 'language',
        cookie: 'language',
        register: global
    })
}

const App = () => {
    
    try {
        const server = app.listen(port, () => {
            logger.info(`=================================`)
            logger.info(`======= ENV: ${env} =======`)
            logger.info(`🚀 App listening on the port ${port}`)
            logger.info(`=================================`)
        })
        SocketController(server)
        connectToDatabase()
        initializeMiddlewares()
        initializeSwagger()
        initializeErrorHandling()
    } catch (error) {
        console.log(error)
    }
}

export default App