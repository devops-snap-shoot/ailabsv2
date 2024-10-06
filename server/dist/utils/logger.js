"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stream = exports.logger = void 0;
const tslib_1 = require("tslib");
const log_1 = require("@configs/log");
const fs_1 = (0, tslib_1.__importDefault)(require("fs"));
const path_1 = (0, tslib_1.__importDefault)(require("path"));
const winston_1 = (0, tslib_1.__importDefault)(require("winston"));
const winston_daily_rotate_file_1 = (0, tslib_1.__importDefault)(require("winston-daily-rotate-file"));
// logs dir
const logDir = path_1.default.join(__dirname, log_1.dir);
if (!fs_1.default.existsSync(logDir)) {
    fs_1.default.mkdirSync(logDir);
}
// Define log format
const logFormat = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`));
/*
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */
const logger = winston_1.default.createLogger({
    transports: [
        // debug log setting
        new winston_daily_rotate_file_1.default({
            level: 'debug',
            datePattern: 'YYYY-MM-DD',
            dirname: logDir + '/debug',
            filename: `%DATE%.log`,
            maxFiles: 30,
            json: false,
            zippedArchive: true,
            format: logFormat
        }),
        // error log setting
        new winston_daily_rotate_file_1.default({
            level: 'error',
            datePattern: 'YYYY-MM-DD',
            dirname: logDir + '/error',
            filename: `%DATE%.log`,
            maxFiles: 30,
            handleExceptions: true,
            json: false,
            zippedArchive: true,
            format: logFormat
        }),
        new winston_1.default.transports.Console({
            format: winston_1.default.format.combine(winston_1.default.format.splat(), winston_1.default.format.colorize(), logFormat)
        })
    ]
});
exports.logger = logger;
const stream = {
    write: (message) => {
        logger.info(message.substring(0, message.lastIndexOf('\n')));
    }
};
exports.stream = stream;
//# sourceMappingURL=logger.js.map