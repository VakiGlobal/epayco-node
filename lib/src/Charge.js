'use strict'

const Epayco = require('../Epayco')

class Charge extends Epayco {
  constructor ({ apiKey, privateKey, lang, test }) {
    super({ apiKey, privateKey, lang, test })
  }

  async create ({ currency, customerId, description, docNumber, docType, email, lastName, name, tokenCard, value }) {
    try {
      const paymentDefaults = {
        dues: '1',
        tax: '0' // IVA
      }

      const paymentInfo = {
        ...paymentDefaults,
        currency: currency.toString(),
        customer_id: customerId,
        description: description.toString(),
        doc_number: docNumber.toString(),
        doc_type: docType.toString(),
        email: email.toString(),
        last_name: lastName.toString(),
        name: name.toString(),
        tax_base: value.toString(),
        token_card: tokenCard.toString(),
        value: value.toString()
      }

      const createChargePromise = this.request('POST', '/payment/v1/charge/create', paymentInfo, false)
      const charge = await createChargePromise
      const response = charge.body
      return response
    } catch (err) {
      throw err
    }
  }

  async get (uid) {
    try {
      const apiUrl = `/restpagos/transaction/response.json?ref_payco=${uid}&&public_key=${this.apiKey}`
      const getChargePromise = this.request('GET', apiUrl, {}, true)
      const chargeInfo = await getChargePromise
      const response = chargeInfo.body
      return response
    } catch (err) {
      throw err
    }
  }
}

module.exports = Charge
