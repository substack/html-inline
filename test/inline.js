var test = require('tape');
var inliner = require('../');
var fs = require('fs');
var concat = require('concat-stream');
var expected = fs.readFileSync(__dirname + '/files/expected.html', 'utf8');

test('inline', function (t) {
    t.plan(1);
    var inline = inliner({ basedir: __dirname + '/files' });
    var r = fs.createReadStream(__dirname + '/files/index.html');
    r.pipe(inline).pipe(concat(function (body) {
        t.equal(body.toString('utf8'), expected);
    }));
});
