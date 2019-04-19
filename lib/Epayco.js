'use strict'

const CryptoJS = require('crypto-js')
const ip = require('ip')
const { get, post } = require('superagent')

const EpaycoError = require('./EpaycoError')
const langKeys = require('./keylang.json')

const serverIP = ip.address()

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
    this.lang = lang || 'ES'
    this.test = !!test
  }

  async request (method, path, data, sw) {
    try {
      let apiUrl = BASE_URL

      Object.defineProperties(data, {
        ip: {
          enumerable: true,
          value: serverIP
        },
        test: {
          enumerable: true,
          value: this.test
        }
      })

      if (sw) {
        apiUrl = BASE_URL_SECURE
        data = this.setMetadata(data, this.privateKey, this.apiKey, this.test)
      }

      const url = apiUrl + path
      let requestPromise
      if (method !== 'GET') {
        requestPromise = post(url)
          .auth(this.apiKey, '')
          .set('type', 'sdk')
          .send(data)
      } else {
        requestPromise = get(url)
          .auth(this.apiKey, '')
          .query('type', 'sdk')
          .send(data)
      }

      const apiResponse = await requestPromise
      return apiResponse
    } catch (err) {
      const error = new EpaycoError(err.message)
      throw error
    }
  }

  setMetadata (data, privateKey = this.privateKey, publicKey = this.apiKey, test = this.test) {
    const set = {}
    Object.getOwnPropertyNames(data).forEach(dataKey => {
      const propName = this.langKey(dataKey)
      const nonEncryptedText = data[dataKey].toString()
      const propValue = this.encrypt(nonEncryptedText, privateKey)

      set[propName] = propValue
    })

    const testMode = this.encrypt(test, privateKey)
    const { i, p } = this.encryptHex(privateKey)
    Object.defineProperties(set, {
      enpruebas: {
        enumerable: true,
        value: testMode
      },
      i: {
        enumerable: true,
        value: i
      },
      lenguaje: {
        enumerable: true,
        value: 'javascript'
      },
      p: {
        enumerable: true,
        value: p
      },
      public_key: {
        enumerable: true,
        value: publicKey
      }
    })

    return set
  }

  langKey (value) {
    if (langKeys[value]) {
      return langKeys[value]
    }
    return value
  }

  encrypt (textValue, privateKey = this.privateKey) {
    const key = CryptoJS.enc.Hex.parse(privateKey)
    const iv = CryptoJS.enc.Hex.parse('0000000000000000')

    const text = CryptoJS.AES.encrypt(textValue.toString(), key, {
      iv: iv
    })

    return text.ciphertext.toString(CryptoJS.enc.Base64)
  }

  encryptHex (privateKey = this.privateKey) {
    const key = CryptoJS.enc.Hex.parse(privateKey)
    const iv = CryptoJS.enc.Hex.parse('0000000000000000')
    return {
      i: iv.toString(CryptoJS.enc.Base64),
      p: key.toString(CryptoJS.enc.Base64)
    }
  }
}

/**
 * Expose constructor
 */
module.exports = Epayco
