import winston from "winston";
require("dotenv").config();

const logger = winston.createLogger({
    level: process.env.DEBUG_LEVEL || "debug",
    format: winston.format.cli(),
    transports: [
        new winston.transports.Console()
    ]
});

module.exports = logger;