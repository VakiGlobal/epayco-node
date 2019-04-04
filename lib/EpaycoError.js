'use strict'

function EpaycoError () {
  Error.captureStackTrace(this, this.constructor)
  this.name = this.constructor.name
  this.message = 'A default message'
}

// Inheritance
Object.setPrototypeOf(EpaycoError.prototype, Error.prototype)
Object.setPrototypeOf(EpaycoError, Error)

module.exports = EpaycoError
