'use strict'

const Epayco = require('../Epayco')
const EpaycoError = require('../EpaycoError')

class Token extends Epayco {
  constructor ({ apiKey, privateKey, lang, test }) {
    super({ apiKey, privateKey, lang, test })
  }

  async create ({ cardNumber, cvc, expMonth, expYear }) {
    try {
      const cardData = {}
      Object.defineProperties(cardData, {
        'card[number]': {
          enumerable: true,
          value: cardNumber.toString()
        },
        'card[cvc]': {
          enumerable: true,
          value: cvc.toString()
        },
        'card[exp_month]': {
          enumerable: true,
          value: expMonth.toString()
        },
        'card[exp_year]': {
          enumerable: true,
          value: expYear.toString()
        }
      })

      const paycoRequestPromise = this.request('POST', '/v1/tokens', cardData, false)
      const paycoResponseToken = await paycoRequestPromise
      return paycoResponseToken
    } catch (err) {
      const error = new EpaycoError('Error creando token')
      throw error
    }
  }
}

module.exports = Token
