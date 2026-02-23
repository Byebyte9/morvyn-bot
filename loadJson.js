const fs = require("fs")
const path = require("path")
const { handleError } = require("./src/utils/errors/globalErrorHandler")

function loadJson(relativePath) {
try {

// 🔥 base fixa do projeto
const baseDir = path.resolve(__dirname)

const fullPath = path.join(baseDir, relativePath)

const raw = fs.readFileSync(fullPath, "utf-8")

return JSON.parse(raw)

} catch (error) {

handleError(error, `Erro ao carregar ${relativePath}`)
process.exit(1)
}
}

module.exports = loadJson