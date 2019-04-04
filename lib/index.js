'use strict'

const EpaycoError = require('./EpaycoError')
const requestPackage = require('superagent')

/**
 * Resources
 */
// const Token = require('./resources/token')
// const Customers = require('./resources/customers')
// const Subscriptions = require('./resources/subscriptions')
// const Bank = require('./resources/bank')
// const Cash = require('./resources/cash')
// const Charge = require('./resources/charge')
// const Plans = require('./resources/plans')
// const EpaycoError = require('./resources/errors')

const BASE_URL = 'https://api.secure.payco.co'
const BASE_URL_SECURE = 'https://secure.payco.co'

/**
 * Epayco constructor
 *
 * @param {Object} options
 * @return {Epayco} API client instance
 * @api public
 */
class Epayco {
  constructor ({ apiKey, privateKey, lang, test }) {
    this.apiKey = apiKey || 'DEFAULT_API_KEY'
    this.privateKey = privateKey || 'DEFAULT_PRIVATE_KEY'
    this.lang = lang || 'en'
    this.test = test || false
    // const nonValidConfig = (
    //   typeof options.apiKey !== 'string' ||
    //   typeof options.privateKey !== 'string' ||
    //   typeof options.lang !== 'string' ||
    //   typeof options.test !== 'boolean'
    // )

    // if (nonValidConfig) {
    //   throw new EpaycoError(lang, 100);
    // }
  }

  async request (method, path, data, sw) {
    try {
      const apiUrl = sw ? BASE_URL_SECURE : BASE_URL
      const url = apiUrl + path

      const requestSetup = requestPackage(method, url)
        .auth({
          user: this.apiKey,
          password: ''
        })
        .set('type', 'sdk')

      const requestData = data || {}
      let requestPromise
      if (method !== 'GET') {
        requestPromise = requestSetup.send(requestData)
      } else {
        requestPromise = requestSetup.query(requestData)
      }

      const apiResponse = await requestPromise
      return apiResponse
    } catch (err) {
      const error = new EpaycoError()
      throw error
    }
  }
}
// function Epayco (options) {
//   if (!(this instanceof Epayco)) {
//     return new Epayco(options)
//   }

//   if (

//   ) {
//     throw new EpaycoError(options.lang, 100)
//   }

//   /**
//    * Init settings
//    */
//   this.apiKey = options.apiKey
//   this.privateKey = options.privateKey
//   this.lang = options.lang
//   this.test = options.test ? 'TRUE' : 'FALSE'

//   /**
//    * Resources
//    */
//   this.token = new Token(this)
//   this.customers = new Customers(this)
//   this.plans = new Plans(this)
//   this.subscriptions = new Subscriptions(this)
//   this.bank = new Bank(this)
//   this.cash = new Cash(this)
//   this.charge = new Charge(this)
// }

/**
 * Expose constructor
 */
module.exports = Epayco
