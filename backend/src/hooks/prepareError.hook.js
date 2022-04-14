module.exports = context => {
    if (!context.error) {
        context.error = {}
    }
    context.error.customMessage = ''
    context.error.errorPath = ''
    context.error.customMessage += `<${context.error.message}, `
    context.error.customMessage += `Data: ${JSON.stringify(context.data)}>`
    context.error.errorPath += `<[${context.method} ${context.path}]>`
    return context
}