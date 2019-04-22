const test = require('ava')

const Epayco = require('../lib/Epayco')

let epayco = null
test.beforeEach(() => {
  epayco = new Epayco({})
})

test.serial('Should has defaults', t => {
  const defaults = {
    apiKey: 'DEFAULT_API_KEY',
    privateKey: 'DEFAULT_PRIVATE_KEY',
    lang: 'ES',
    test: false
  }

  const { apiKey, privateKey, lang, test } = epayco
  t.deepEqual({ apiKey, privateKey, lang, test }, defaults)
})

test.serial('Should throws with no args', t => {
  const error = t.throws(() => new Epayco(), TypeError)
  t.is(error.message, 'Cannot destructure property `apiKey` of \'undefined\' or \'null\'.')
})

test.serial('Should has a .request method', t => {
  t.truthy(epayco.request)
})

test.serial('Should has a .setMetadata method', t => {
  t.truthy(epayco.setMetadata)
})

test.serial('Should has a .langKey method', t => {
  t.truthy(epayco.langKey)
})

test.serial('Should has a .encrypt method', t => {
  t.truthy(epayco.encrypt)
})

test.serial('Should has a .encryptHex method', t => {
  t.truthy(epayco.encryptHex)
})
