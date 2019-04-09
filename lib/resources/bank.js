'use strict'

const Epayco = require('../Epayco')

class Bank extends Epayco {
  constructor ({ apiKey, privateKey, lang, test }) {
    super({ apiKey, privateKey, lang, test })
  }

  async create ({ cellPhone, codeBank, docNumber, docType, email, lastName, name, typePerson, value }) {
    try {
      const pseDefaults = {
        country: 'CO',
        currency: 'COP',
        method_confirmation: 'GET',
        tax: '0',
        tax_base: '0',
        url_confirmation: 'https:/secure.payco.co/restpagos/testRest/endpagopse.php',
        url_response: 'https:/secure.payco.co/restpagos/testRest/endpagopse.php'
      }

      const pseInfo = {
        ...pseDefaults,
        bank: codeBank.toString(),
        cell_phone: cellPhone.toString(),
        doc_number: docNumber.toString(),
        doc_type: docType.toString(),
        email: email.toString(),
        last_name: lastName.toString(),
        name: name.toString(),
        type_person: typePerson.toString(),
        value: value.toString()
      }

      const generatePsePromise = this.request('POST', '/restpagos/pagos/debitos.json', pseInfo, true)
      const pse = await generatePsePromise
      return pse
    } catch (err) {
      throw err
    }
  }

  async get (uid) {
    const apiUrl = `/restpagos/pse/transactioninfomation.json?transactionID=${uid}&&public_key=${this.apiKey}`
    this.request('GET', apiUrl, {}, true)
  }
}

module.exports = Bank
