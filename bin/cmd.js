#!/usr/bin/env node

var fs = require('fs')
var path = require('path')
var minimist = require('minimist')
var inliner = require('../index')

var argv = minimist(process.argv.slice(2), {
    alias: {
      i: 'infile',
      o: 'outfile',
      c: 'cwd',
      h: 'help',
      I: 'images',
      H: 'imports',
      J: 'scripts',
      S: 'styles'
    },
    default: { outfile: '-' }
})

if (argv.help) return usage(0)

var infile = argv.infile || argv._[0]
if (!argv.cwd && infile) {
    argv.cwd = path.resolve(path.dirname(infile))
}
var inline = inliner(argv)
var input = infile === '-' || !infile
  ? process.stdin
  : fs.createReadStream(infile)

var output = argv.outfile === '-'
  ? process.stdout
  : fs.createWriteStream(argv.outfile)

input.pipe(inline).pipe(output)

function usage (code) {
  var r = fs.createReadStream(__dirname +'/usage.txt')
  r.pipe(process.stdout)
  r.on('end', function () {
    if (code) process.exit(code)
  })
}
