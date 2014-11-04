var test = require('tape');
var inliner = require('../');
var fs = require('fs');
var concat = require('concat-stream');
var initial = fs.readFileSync(__dirname + '/files/index.html', 'utf8');
var expected = fs.readFileSync(__dirname + '/files/expected.html', 'utf8');
var expectedIgnoreImages = fs.readFileSync(__dirname + '/files/expected-ignore-images.html', 'utf8');
var expectedIgnoreScripts = fs.readFileSync(__dirname + '/files/expected-ignore-scripts.html', 'utf8');
var expectedIgnoreStyles = fs.readFileSync(__dirname + '/files/expected-ignore-styles.html', 'utf8');

test('inline', function (t) {
    t.plan(1);
    var inline = inliner({ basedir: __dirname + '/files' });
    var r = fs.createReadStream(__dirname + '/files/index.html');
    r.pipe(inline).pipe(concat(function (body) {
        t.equal(body.toString('utf8'), expected);
    }));
});

test('ignore-images', function (t) {
    t.plan(1);
    var inline = inliner({ basedir: __dirname + '/files', ignoreImages: true });
    var r = fs.createReadStream(__dirname + '/files/index.html');
    r.pipe(inline).pipe(concat(function (body) {
        t.equal(body.toString('utf8'), expectedIgnoreImages);
    }));
});

test('ignore-scripts', function (t) {
    t.plan(1);
    var inline = inliner({ basedir: __dirname + '/files', ignoreScripts: true });
    var r = fs.createReadStream(__dirname + '/files/index.html');
    r.pipe(inline).pipe(concat(function (body) {
        t.equal(body.toString('utf8'), expectedIgnoreScripts);
    }));
});

test('ignore-styles', function (t) {
    t.plan(1);
    var inline = inliner({ basedir: __dirname + '/files', ignoreStyles: true });
    var r = fs.createReadStream(__dirname + '/files/index.html');
    r.pipe(inline).pipe(concat(function (body) {
        t.equal(body.toString('utf8'), expectedIgnoreStyles);
    }));
});

test('ignore-all', function (t) {
    t.plan(1);
    var inline = inliner({
        basedir: __dirname + '/files',
        ignoreImages: true,
        ignoreScripts: true,
        ignoreStyles: true });
    var r = fs.createReadStream(__dirname + '/files/index.html');
    r.pipe(inline).pipe(concat(function (body) {
        t.equal(body.toString('utf8'), initial);
    }));
});
