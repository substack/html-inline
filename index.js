'use strict'

var path = require('path')
var trumpet = require('trumpet')
var isObject = require('is-real-object')
var escapeHtml = require('escape-html')
var readSource = require('./lib/read-source')
var inlineLink = require('./lib/inline-link')
var encodeImage = require('./lib/encode-image')

module.exports = function inline (options) {
  options = isObject(options) ? options : {}
  options = mixin({
    cwd: process.cwd(),
    images: true,
    imports: true,
    scripts: true,
    styles: true
  }, options)

  var tr = trumpet()

  if (options.scripts) {
    tr.selectAll('script[src]', function (node) {
      var url = node.getAttribute('src')
      node.removeAttribute('src')
      readSource(url, options).pipe(node.createWriteStream())
    })
  }
  if (options.styles || options.imports) {
    tr.selectAll('link[href]', function (node) {
      var rel = node.getAttribute('rel').toLowerCase()
      if (rel === 'stylesheet' && options.styles) {
        inlineLink(node, options, true)
      }
      if (rel === 'import' && options.imports) {
        inlineLink(node, options, false)
      }
    })
  }
  if (options.images) {
    tr.selectAll('img[src]', function (node) {
      var url = node.getAttribute('src')
      var ext = path.extname(url).replace(/^\./, '')
      var w = node.createWriteStream({outer: true})
      var attrs = node.getAttributes()

      w.write('<img')
      Object.keys(attrs).forEach(function (key) {
        if (key === 'src') return
        w.write(' ' + key + '="' + escapeHtml(attrs[key]) + '"')
      })
      w.write(' src="data:image/' + ext + ';base64,')

      readSource(url, options).pipe(encodeImage()).pipe(w)
    })
  }
  return tr
}
/**
 * utils
 */

function mixin (target, obj) {
  for (var key in obj) {
    if (hasOwn(obj, key)) {
      target[key] = obj[key]
    }
  }
  return target
}

function hasOwn (obj, val) {
  return Object.prototype.hasOwnProperty.call(obj, val)
}
