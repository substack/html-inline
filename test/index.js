'use strict'

var fs = require('fs')
var path = require('path')
var test = require('tape')
var inliner = require('../index')
var concat = require('concat-stream')
var cwd = path.join(__dirname, '/fixture')
var fixture = path.join(cwd, 'index.html')

function readFixture (name) {
  return fs.readFileSync(path.join(__dirname, 'expected', name), 'utf-8')
}

test('inline all', function (t) {
  t.plan(1)
  var inline = inliner({cwd: cwd})
  var r = fs.createReadStream(fixture)
  r.pipe(inline).pipe(concat(function (body) {
      t.equal(body.toString('utf-8'), readFixture('inline-all.html'))
  }))
})

test('ignore images (images:false)', function (t) {
  t.plan(1)
  var inline = inliner({cwd: cwd, images: false})
  var r = fs.createReadStream(fixture)
  r.pipe(inline).pipe(concat(function (body) {
      t.equal(body.toString('utf-8'), readFixture('ignore-images.html'))
  }))
})

test('ignore imports (imports:false)', function (t) {
  t.plan(1)
  var inline = inliner({cwd: cwd, imports: false})
  var r = fs.createReadStream(fixture)
  r.pipe(inline).pipe(concat(function (body) {
      t.equal(body.toString('utf-8'), readFixture('ignore-imports.html'))
  }))
})

test('ignore scripts (scripts:false)', function (t) {
  t.plan(1)
  var inline = inliner({cwd: cwd, scripts: false})
  var r = fs.createReadStream(fixture)
  r.pipe(inline).pipe(concat(function (body) {
      t.equal(body.toString('utf-8'), readFixture('ignore-scripts.html'))
  }))
})

test('ignore styles (styles:false)', function (t) {
  t.plan(1)
  var inline = inliner({cwd: cwd, styles: false})
  var r = fs.createReadStream(fixture)
  r.pipe(inline).pipe(concat(function (body) {
      t.equal(body.toString('utf-8'), readFixture('ignore-styles.html'))
  }))
})

test('ignore all', function (t) {
  t.plan(1)
  var inline = inliner({
    cwd: cwd,
    images: false,
    imports: false,
    scripts: false,
    styles: false
  })
  var r = fs.createReadStream(fixture)
  r.pipe(inline).pipe(concat(function (body) {
      t.equal(body.toString('utf-8'), readFixture('ignore-all.html'))
  }))
})
