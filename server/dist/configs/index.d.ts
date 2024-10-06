import env from './env';
import keys from './keys';
import dbConfig from './dbConfig';
import cors from './cors';
import log from './log';
import smtp from './smtp';
declare const config: {
    env: {
        onMachine: string;
        environment: string;
        port: string;
        portDev: string;
        locale: string;
        name: string;
        lastName: string;
        run: string;
        email: string;
        password: string;
        url: string;
        platformName: string;
        iaUrl: string;
        iaDomain: string;
        iaPort: string;
        appDomain: string;
        defaultPassw: string;
        storageApi: {
            accessKeys: string;
            url: string;
        };
        localServer: string;
    };
    dbConfig: {
        host: string;
        database: string;
        port: number;
    };
    keys: {
        secretKey: string;
    };
    log: {
        format: string;
        dir: string;
    };
    cors: {
        origin: boolean;
        credentials: boolean;
    };
    smtp: {
        host: string;
        port: number;
        user: string;
        pass: string;
        from_name: string;
        from_email: string;
    };
};
export { env, dbConfig, keys, log, cors, smtp };
export default config;
