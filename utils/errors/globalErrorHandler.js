const CommandError = require("./BotError.js")

function formatError(error, context) {
const isCommandError = error instanceof CommandError
const isOperational = error.isOperational

return `
━━━━━━━━━━ 🚨 ERRO 🚨 ━━━━━━━━━━
📍 Contexto: ${context}
📛 Tipo: ${error.name}
📝 Mensagem: ${error.message}
${error.solution ? `💡 Solução: ${error.solution}`: ""}
${!isOperational ? `📚 Stack:\n${error.stack}`: ""}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`
}

function handleError(error, context = "Erro desconhecido") {

if (!(error instanceof Error)) {
error = new Error("Erro inesperado")
}

console.log(formatError(error, context))
}

function registerGlobalHandlers() {
process.on("uncaughtException", (err) => {
handleError(err, "Erro não tratado (uncaughtException)")
})

process.on("unhandledRejection", (reason) => {
handleError(reason, "Promise não tratada (unhandledRejection)")
})
}

module.exports = {
handleError,
registerGlobalHandlers
}