'use strict'

const Epayco = require('../index')
const EpaycoError = require('../EpaycoError')
// /**
//  * Module dependencies
//  */
// var util = require('util');
// var Resource = require('./');

// /**
//  * Expose constructor
//  */
// module.exports = token;

// /**
//  * Customers constructor
//  */
// function token(epayco) {
//     Resource.call(this, epayco);
// }

// util.inherits(token, Resource);

// /**
//  * Create Token
//  * @param {Object} options
//  * @api public
//  */
// token.prototype.create = function(options) {
//     return this.request('post', '/v1/tokens', options, sw = false);
// };

class Token extends Epayco {
  constructor ({ apiKey, privateKey, lang, test }) {
    super({ apiKey, privateKey, lang, test })
  }

  async create ({ cardNumber, cvc, expMonth, expYear }) {
    try {
      const cardData = {}
      Object.defineProperties(cardData, {
        'card[number]': {
          value: cardNumber
        },
        'card[cvc]': {
          value: cvc
        },
        'card[expMonth]': {
          value: expMonth
        },
        'card[expYear]': {
          value: expYear
        }
      })

      const paycoRequestPromise = this.request('POST', '/v1/tokens', cardData, false)
      const paycoResponseToken = await paycoRequestPromise
      return paycoResponseToken
    } catch (err) {
      const error = new EpaycoError()
      throw error
    }
  }
}

new Token({
  apiKey: '45b960805ced5c27ce34b1600b4b9f54',
  privateKey: '5c4773856f296c674685209bbfd11f92',
  lang: 'ES',
  test: process.env.NODE_ENV !== 'PRODUCTION'
}).create({
  cardNumber: 4575623182290326,
  cvc: 123,
  expMonth: 12,
  expYear: 2020
})
.then(r => console.debug(r.body))
.catch(e => console.error(e))

module.exports = Token
