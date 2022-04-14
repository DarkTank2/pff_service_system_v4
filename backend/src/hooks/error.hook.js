const logger = require('../logger')

module.exports = context => {
    let { error } = context
    console.log(error)
    logger.error(`Error with path: ${error.errorPath}`)
    logger.error(`Reason: ${context.error.customMessage}`)
    return context
}