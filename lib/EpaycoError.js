'use strict'

const errors = require('./errors.json')

function EpaycoError (code, lang) {
  Error.captureStackTrace(this, this.constructor)
  this.name = this.constructor.name
  this.message = errors[code][lang] || code
}

// Inheritance
Object.setPrototypeOf(EpaycoError.prototype, Error.prototype)
Object.setPrototypeOf(EpaycoError, Error)

module.exports = EpaycoError
