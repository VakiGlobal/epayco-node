const Epayco = require('../index')

class Charge extends Epayco {
  constructor ({ apiKey, privateKey, lang, test }) {
    super({ apiKey, privateKey, lang, test })
  }

  async create (options) {
    try {
      const createChargePromise = this.request('GET', '/payment/v1/charge/create', options, false)
      const charge = await createChargePromise
      return charge
    } catch (err) {
      throw err
    }
  }

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
}

module.exports = Charge
