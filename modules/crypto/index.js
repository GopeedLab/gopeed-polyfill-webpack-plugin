'use strict'

exports.getRandomValues = function (abv) {
  return globalThis.crypto.getRandomValues(abv)
}

exports.randomUUID = function () {
  return globalThis.crypto.randomUUID()
}