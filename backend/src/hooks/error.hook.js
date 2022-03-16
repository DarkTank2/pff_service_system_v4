const logger = require('../logger')

module.exports = async context => {
    let { error } = context
    logger.error(`Error with path: ${error.errorPath}`)
    logger.error(`Reason: ${context.error.customMessage}`)
    return context
}