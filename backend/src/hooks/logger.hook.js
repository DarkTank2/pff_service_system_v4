const logger = require('../logger')

module.exports = async context => {
    logger.info(`[${context.method} ${context.path}]`)
    logger.info(`params: ${JSON.stringify(context.params)}`)
    return context
}