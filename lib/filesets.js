// Build include and exclude filesets for _Plato_ and _JSHint_ based on a
// common fileset format. Paths ending with a `/` are assumed to be a directory,
// all other paths are assumed to be a file. Individual files will be included
// or excluded as is. Directories will include or exclude all javascript files
// contained in them.

var util = require('util');
var async = require('async');
var chalk = require('chalk');

// By default include `lib`, `index.js` and `app.js`, exclude nothing.

var includeFileset = [ './lib/', 'index.js', 'app.js' ];
var excludeFileset = [ ];
var filterFileset = [ ];

// Directories are identified in filesets by virtue of having a trailing `/`.

function isDirectory(filename) {
    return filename.slice(-1) === '/';
}

// Filesets are validated by ensuring the fileset is an array and each item is a
// string. Valid filesets are applied, invalid ones are ignored.

function validateFileset(fileset, setter) {
    if (Array.isArray(fileset)) {
        async.each(fileset, function(path, callback) {
            if (typeof path === 'string') {
                callback();
            } else {
                callback(util.format('Invalid path: %s', path));
            }
        }, function(err) {
            if (err) {
                console.log(chalk.red(err));
            } else {
                setter(fileset);
            }
        });
    } else {
        console.log(chalk.red('Fileset is not an array: %j'), fileset);
    }
}

function setIncludeFileset(fileset) {
    includeFileset = fileset;
}

function setExcludeFileset(fileset) {
    excludeFileset = fileset;
}

// The default filesets can be overridden using the `include` and `exclude`
// functions. If the fileset is invalid (i.e. not an array of strings) then an
// error is logged and the fileset will not be set. In addition the include
// fileset can be further filtered so that only a subset is used by Plato.

function include(fileset, filter) {

    if (filter) {
        filterFileset = filter;
    }

    validateFileset(fileset, setIncludeFileset);
}

function exclude(fileset) {
    validateFileset(fileset, setExcludeFileset);
}

// The plato include set is in the same format as our include set, however we
// remove any items in the filter fileset first.

function platoIncludes() {
    return includeFileset.filter(function(path) {
        return filterFileset.indexOf(path) === -1;
    });
}

// Plato uses a regular expression to exclude files so turn the list of exclude
// files into a properly formatted, pipe delimited list of files. If there are
// no filesets to exclude then `null` is returned.

function platoExcludes() {
    var excludes = '';
    excludeFileset.forEach(function (file) {
        if (isDirectory(file)) {
            excludes += file.replace(/\//g, '\/');
        } else {
            excludes += file;
        }
        excludes += '|';
    });

    if (excludes !== '') {
        return new RegExp(excludes.slice(0, -1));
    } else {
        return null;
    }
}

// JS Hint uses a globbing format for both include and exclude filesets. Files
// are added as is, directories are added using `**/*.js` which includes all
// Javascript files in all subdirectories.

function jshintFileset(fileset) {
    var files = [];
    fileset.forEach(function (file) {
        if (isDirectory(file)) {
            files.push(file + '**/*.js');
        } else {
            files.push(file);
        }
    });

    return files;
}

function jshintIncludes() {
    return jshintFileset(includeFileset);
}

function jshintExcludes() {
    return jshintFileset(excludeFileset);
}

module.exports.include = include;
module.exports.exclude = exclude;
module.exports.platoIncludes = platoIncludes;
module.exports.platoExcludes = platoExcludes;
module.exports.jshintIncludes = jshintIncludes;
module.exports.jshintExcludes = jshintExcludes;

// ## License
//
// Copyright (c) 2014, RainBird Technologies <follow@rainbird.ai>
//
// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.
//
// THE SOFTWARE IS PROVIDED 'AS IS' AND THE AUTHOR DISCLAIMS ALL WARRANTIES
// WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
// ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
// WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
// ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
// OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.