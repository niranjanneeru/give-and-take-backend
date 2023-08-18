import winston from "winston";
import loggerFactory from "./logger.config";

class Logger {
    private static logger = null;

    static getLogger(): winston.Logger {
        if (!this.logger) {
            this.logger = loggerFactory("info", [
                new winston.transports.File({
                    filename: 'error.log', level: 'error',
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        this.routeLoggerFormat
                    )
                }),
                new winston.transports.File({
                    filename: 'combined.log',
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        this.routeLoggerFormat
                    )
                })
            ])
        };
        return this.logger;
    }

    static routeLoggerFormat = winston.format.printf(({ level, message, label, timestamp }) => {
        return `${timestamp} [${label}] ${level}: ${message}`;
    });
}

export default Logger