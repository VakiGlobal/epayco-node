'use strict'

const moment = require('moment')
const Epayco = require('../Epayco')

class Cash extends Epayco {
  constructor ({ apiKey, privateKey, lang, test }) {
    super({ apiKey, privateKey, lang, test })
  }

  async create ({ description, docNumber, docType, email, lastName, name, value, method, expireDays = 3 }) {
    try {
      if (isNaN(expireDays)) {
        const error = new Error('Expire days must be a number')
        throw error.message
      }

      const paymentDefaults = {
        currency: 'COP',
        method_confirmation: 'GET',
        tax: '0', // IVA per transactions
        url_confirmation: 'https:/secure.payco.co/restpagos/testRest/endpagopse.php',
        url_response: 'https:/secure.payco.co/restpagos/testRest/endpagopse.php'
      }

      // Doc types:
      // (CC, CE, PPN, SSN, LIC, NIT, DNI)

      // Expire date will be current day + 15 days, the YYYY-MM-DD format is required by ePayco API
      const expireDate = moment().add(expireDays, 'days').format('YYYY-MM-DD')
      const paymentData = {
        ...paymentDefaults,
        doc_number: docNumber.toString(),
        doc_type: docType.toString(),
        email: email.toString(),
        end_date: expireDate,
        last_name: lastName.toString(),
        name: name.toString(),
        value: value.toString()
      }

      paymentData.description = description || 'Default description'

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
