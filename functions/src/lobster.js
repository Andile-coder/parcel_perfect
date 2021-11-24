const functions = require("firebase-functions");

const isDevelop = () => {
    return process.env.ENVIRONMENT === "development";
}

const info = (title, message) => {
    if (isDevelop()) {
        console.info(title, message);
    } else {
        functions.logger.info(title, message);
    }
}

const error = (title, message) => {
    if (isDevelop()) {
        console.error(title, message);
    } else {
        functions.logger.error(title, message);
    }
}

const warn = (title, message) => {
    if (isDevelop()) {
        console.warn(title, message);
    } else {
        functions.logger.warn(title, message);
    }
}

const log = (title, message) => {
    if (isDevelop()) {
        console.log(title, message);
    } else {
        functions.logger.log(title, message);
    }
}

const lobster = {
    info: info,
    error: error,
    warn: warn,
    log: log,
}

module.exports = lobster;