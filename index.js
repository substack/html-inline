var trumpet = require('trumpet');
var through = require('through2');
var fs = require('fs');
var path = require('path');
var url = require('url');

module.exports = function (opts) {
    if (!opts) opts = {};
    var basedir = opts.basedir || process.cwd();
    var tr = trumpet();

    if (!(opts.ignoreScripts || opts['ignore-scripts'])) {
        tr.selectAll('script[src]', function (node) {
            var file = fix(node.getAttribute('src'));
            if (file) {
                node.removeAttribute('src');
                fs.createReadStream(file)
                    .pipe(node.createWriteStream())
                ;
            }
        });
    }

    if (!(opts.ignoreImages || opts['ignore-images'])) {
        tr.selectAll('img[src]', function (node) {
            var file = fix(node.getAttribute('src'));
            if (file) {
                var w = node.createWriteStream({ outer: true });
                var attrs = node.getAttributes();
                w.write('<img');
                Object.keys(attrs).forEach(function (key) {
                    if (key === 'src') return;
                    w.write(' ' + key + '="' + enc(attrs[key]) + '"');
                });
                var ext = path.extname(file).replace(/^\./, '');;
                w.write(' src="data:image/' + ext + ';base64,');
                fs.createReadStream(file).pipe(through(write, end));
            }

            function write (buf, enc, next) {
                w.write(buf.toString('base64'));
                next();
            }
            function end () {
                w.end('">');
            }
        });
    }

    if (!(opts.ignoreStyles || opts['ignore-styles'])) {
        tr.selectAll('link[href]', function (node) {
            var rel = node.getAttribute('rel').toLowerCase();
            if (rel !== 'stylesheet') return;
            var file = fix(node.getAttribute('href'));

            if (file) {
                var w = node.createWriteStream({ outer: true });
                w.write('<style>');
                var r = fs.createReadStream(file);
                r.pipe(w, { end: false });
                r.on('end', function () { w.end('</style>') });
            }
        });
    }

    return tr;

    function fix (p) {
        var rv = null;
        if (! url.parse(p, null, true).hostname) {
            rv = path.resolve(basedir, path.relative('/', path.resolve('/', p)));
        }
        return rv;
    }
    function enc (s) {
        return s.replace(/"/g, '&#34;')
            .replace(/>/g, '&gt;')
            .replace(/</g, '&lt;')
        ;
    }
};
