require("dotenv").config();
const Sequelize = require('sequelize');
const logger = require('../utils/logger');

var sequelize = new Sequelize(
    process.env.DB_DATABASE, 
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        dialect: "mysql",
        logging: false,
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        }
    });

const OtpRecord = sequelize.import('./otprecord');

sequelize.sync()
    .then(() => {
        logger.debug("Sequelize sync success!");
    })
    .error((err) => {
        logger.debug("Sequelize sync failed: " + err);
    })

module.exports = {
    OtpRecord,
    sequelize
};