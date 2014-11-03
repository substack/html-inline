#!/usr/bin/env node

var inliner = require('../');
var fs = require('fs');

var inline = inliner({ basedir: process.cwd() });

process.stdin.pipe(inline).pipe(process.stdout);
