"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.localServer = exports.storageApi = exports.defaultPassw = exports.appDomain = exports.iaPort = exports.iaDomain = exports.iaUrl = exports.platformName = exports.url = exports.password = exports.email = exports.run = exports.lastName = exports.name = exports.locale = exports.portDev = exports.port = exports.environment = exports.onMachine = void 0;
const environment = process.env.NODE_ENV;
exports.environment = environment;
const port = process.env.PORT;
exports.port = port;
const portDev = process.env.PORT_DEV;
exports.portDev = portDev;
const locale = process.env.DEFAULT_LANGUAGE;
exports.locale = locale;
const name = process.env.NAME;
exports.name = name;
const lastName = process.env.LASTNAME;
exports.lastName = lastName;
const run = process.env.RUN;
exports.run = run;
const email = process.env.EMAIL;
exports.email = email;
const password = process.env.PASSWORD;
exports.password = password;
const url = process.env.URL || `http://localhost:${port}`;
exports.url = url;
const platformName = process.env.PLATFORM_NAME;
exports.platformName = platformName;
const iaPort = process.env.IA_PORT;
exports.iaPort = iaPort;
const iaUrl = `http://${process.env.IA_DOMAIN}:${process.env.IA_PORT}`;
exports.iaUrl = iaUrl;
const iaDomain = process.env.IA_DOMAIN;
exports.iaDomain = iaDomain;
const appDomain = process.env.APP_DOMAIN;
exports.appDomain = appDomain;
const defaultPassw = process.env.DEFAULT_PASSWORD;
exports.defaultPassw = defaultPassw;
const localServer = process.env.LOCAL_SERVER;
exports.localServer = localServer;
const onMachine = process.env.ON_MACHINE;
exports.onMachine = onMachine;
const storageApi = {
    accessKeys: process.env.ACCESS_KEYS,
    url: process.env.STORAGE_URL
};
exports.storageApi = storageApi;
const env = { onMachine, environment, port, portDev, locale, name, lastName, run, email, password, url, platformName, iaUrl, iaDomain, iaPort, appDomain, defaultPassw, storageApi, localServer };
exports.default = env;
//# sourceMappingURL=env.js.map