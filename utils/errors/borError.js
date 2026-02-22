class CommandError extends Error {
  constructor(message, solution) {
    super(message)
    this.name = "CommandError"
    this.solution = solution
  }
}

module.exports = CommandError