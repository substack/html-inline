#!/usr/bin/env node

var inliner = require('../');
var fs = require('fs');
var path = require('path');
var minimist = require('minimist');

var argv = minimist(process.argv.slice(2), {
    alias: { i: 'infile', o: 'outfile', b: 'basedir' },
    default: { outfile: '-' }
});
var infile = argv.infile || argv._[0];
if (!argv.basedir && infile) {
    argv.basedir = path.resolve(path.dirname(infile));
}
var inline = inliner(argv);
var input = infile === '-' || !infile
    ? process.stdin
    : fs.createReadStream(infile)
;
var output = argv.outfile === '-'
    ? process.stdout
    : fs.createWriteStream(argv.outfile)
;
input.pipe(inline).pipe(output);
