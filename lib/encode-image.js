'use strict'

var through2 = require('through2')

module.exports = function encodeImage () {
  var last = null
  return through2(function (chunk, enc, next) {
    if (last) {
      chunk = Buffer.concat([last, chunk])
      last = null
    }

    var len = chunk.length
    var remaining = len % 3

    if (remaining !== 0) {
      last = chunk.slice(len - remaining)
      chunk = chunk.slice(0, len - remaining)
    }

    this.push(chunk.toString('base64'))
    next()
  }, function (cb) {
    if (last) this.push(last.toString('base64'))
    this.push('">')
    cb()
  })
}
