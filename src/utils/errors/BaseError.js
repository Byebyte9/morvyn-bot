class BaseError extends Error {
  constructor(message, options = {}) {
    super(message)

    this.name = this.constructor.name
    this.solution = options.solution || null
    this.statusCode = options.statusCode || 500
    this.isOperational = true // erro esperado
  }
}

module.exports = BaseError