const logger = require('../logger')

module.exports = async context => {
    logger.info(`[${context.method} ${context.path}]`)
    return context
}