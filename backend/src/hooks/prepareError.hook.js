module.exports = async context => {
    if (!context.error) {
        context.error = {
            customMessage: '',
            errorPath: ''
        }
    }
    context.error.customMessage += `<${context.error.message}\n`
    context.error.customMessage += `Data: ${JSON.stringify(context.data)}>`
    context.error.errorPath += `<[${context.method} ${context.path}]>`
    return context
}