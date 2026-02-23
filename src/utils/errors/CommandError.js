const BaseError = require("./BaseError")

class CommandError extends BaseError {
  constructor(message, solution) {
    super(message, {
      solution,
      statusCode: 400
    })
  }
}

module.exports = CommandError