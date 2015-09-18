'use strict'

var readSource = require('read-source-stream')

module.exports = function inlineLink (node, options, isStyles) {
  var url = node.getAttribute('href')
  var w = node.createWriteStream({outer: true})
  var read = readSource(url, options)

  if (isStyles) {
    w.write('<style>')
    read.pipe(w, {end: false})
    read.on('end', function () {
      w.end('</style>')
    })
    return read
  }

  return read.pipe(w)
}
