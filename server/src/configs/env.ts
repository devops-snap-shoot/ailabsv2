const environment: string = process.env.NODE_ENV
const port = process.env.PORT
const portDev = process.env.PORT_DEV
const locale: string = process.env.DEFAULT_LANGUAGE
const name: string = process.env.NAME
const lastName: string = process.env.LASTNAME
const run: string = process.env.RUN
const email: string = process.env.EMAIL
const password: string = process.env.PASSWORD
const url = process.env.URL || `http://localhost:${port}`
const platformName = process.env.PLATFORM_NAME
const iaPort = process.env.IA_PORT
const iaUrl = `http://${process.env.IA_DOMAIN}:${process.env.IA_PORT}`
const iaDomain = process.env.IA_DOMAIN
const appDomain = process.env.APP_DOMAIN
const defaultPassw = process.env.DEFAULT_PASSWORD
const localServer = process.env.LOCAL_SERVER

const onMachine = process.env.ON_MACHINE

const storageApi = {
    accessKeys: process.env.ACCESS_KEYS,
    url: process.env.STORAGE_URL
}

const env = { onMachine, environment, port, portDev, locale, name, lastName, run, email, password, url, platformName, iaUrl, iaDomain, iaPort, appDomain, defaultPassw, storageApi, localServer }

export { onMachine, environment, port, portDev, locale, name, lastName, run, email, password, url, platformName, iaUrl, iaDomain, iaPort, appDomain, defaultPassw, storageApi, localServer }
export default env
