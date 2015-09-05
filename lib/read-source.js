'use strict'

var fs = require('fs')
var got = require('got')
var path = require('path')
var isAbs = require('is-absolute-url')

module.exports = function readSource (fp, opts) {
  var cwd = opts.cwd || process.cwd()
  if (/^\/\//.test(fp)) {
    fp = 'http:' + fp
  }
  if (isAbs(fp)) {
    return got.stream(fp)
  }
  fp = path.join(cwd, fp)
  return fs.createReadStream(fp)
}
