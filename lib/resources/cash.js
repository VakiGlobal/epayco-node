'use strict'

const Epayco = require('../Epayco')

class Cash extends Epayco {
  constructor ({ apiKey, privateKey, lang, test }) {
    super({ apiKey, privateKey, lang, test })
  }

  async create ({ description, docNumber, docType, email, lastName, name, value, method }) {
    try {
      const paymentDefaults = {
        currency: 'COP',
        method_confirmation: 'GET',
        tax: '0',
        tax_base: '0',
        url_confirmation: 'https:/secure.payco.co/restpagos/testRest/endpagopse.php',
        url_response: 'https:/secure.payco.co/restpagos/testRest/endpagopse.php'
      }

      const paymentData = {
        ...paymentDefaults,
        description,
        doc_number: docNumber.toString(),
        doc_type: docType.toString(),
        email: email.toString(),
        end_date: '2019-10-10', // MOMENTJS
        last_name: lastName.toString(),
        name: name.toString(),
        value: value.toString()
      }

      const apiUrl = this.getCashAPIUrlOf(method)
      const createCashPromise = this.request('POST', apiUrl, paymentData, true)
      const cash = await createCashPromise
      return cash
    } catch (err) {
      throw err
    }
  }

  // TODO: (juanarbol)
  // This is a duplication of charge.get() method
  // Apply DRY in this
  async get (uid) {
    try {
      const apiUrl = `/restpagos/transaction/response.json?ref_payco=${uid}&&public_key=${this.apiKey}`
      const getChargePromise = this.request('GET', apiUrl, {}, true)
      const chargeInfo = await getChargePromise
      return chargeInfo
    } catch (err) {
      throw err
    }
  }

  getCashAPIUrlOf (method) {
    switch (method) {
      case 'Baloto':
        return '/restpagos/pagos/balotos.json'
      case 'Efecty':
        return '/restpagos/pagos/efecties.json'
      case 'Gana':
        return '/restpagos/pagos/ganas.json'
      default:
        return '/restpagos/pagos/efecties.json'
    }
  }
}

module.exports = Cash
