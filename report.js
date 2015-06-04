// Run JSHint and Plato over the specified files

var fs = require('fs');
var path = require('path');
var async = require('async');
var chalk = require('chalk');
var plato = require('plato');
var Getopt = require('node-getopt');
var buildJSHint = require('build-jshint');

var filesets = require('./lib/filesets.js');
var reporter = require('./lib/reporter.js');

// By default reports are output to `./reports` and given the title of `Plato
// Report`.

var outputDir = 'reports';

var options = {};
var jsHintOptions = {};
var platoOptions = {
    title: 'Plato Report',
    recurse: true,
    quiet: true
};

// Check the path provided by the user, prefixing it with `./` if it's not an
// explicitly provided as an absolute or relative path. Valid paths are passed
// to the provided callback.

function checkPath(string, callback, done) {
    var path = string;
    if (!(/^\.|\//).test(string)) {
        path = './' + string;
    }

    fs.stat(path, function(err) {
        if (err) {
            console.log(chalk.red('Error, cannot open: %s'), string);
            process.exit(1);
        } else {
            callback(path, done);
        }
    });
}

// Plato uses the `jshintrc` as is, whereas JSHint-Build needs the options
// inserted into its own options.

function setJSHint(path, done) {
    var opts = JSON.parse(fs.readFileSync(path, 'utf8'));

    //platoOptions.jshint = path;
    jsHintOptions.config = opts;
    done();
}

// The default `jshintrc` from the linter package can be overridden with the
// `jshint` option. The provided file is checked to ensure it exists before it's
// used.

function checkJSHint(done) {
    if(!options.jshint) options.jshint = path.join(__dirname, ".jshintrc");

    checkPath(options.jshint, setJSHint, done);
}

// Set the filesets from those defined in the provided configuration file. If
// a given fileset isn't defined then a warning will be output. The `lintOnly`
// fileset is an optional fileset that will be excluded from the Plato fileset.

function setFilesets(path, done) {
    var config = JSON.parse(fs.readFileSync(path, 'utf8'));

    /* jshint sub: true */
    var includeFiles = config['includeFiles'];
    var excludeFiles = config['excludeFiles'];
    var filterFiles = config['lintOnly'];
    /* jshint sub: false */

    if (filterFiles && !Array.isArray(filterFiles)) {
        filterFiles = [];
        console.log(chalk.yellow('invalid `lintOnly` set; ignoring'));
    }

    if (includeFiles && Array.isArray(includeFiles)) {
        filesets.include(includeFiles, filterFiles);
    } else {
        console.log(chalk.yellow('valid `includeFiles` not found in %s'), path);
    }

    if (excludeFiles && Array.isArray(includeFiles)) {
        filesets.exclude(excludeFiles);
    } else {
        console.log(chalk.yellow('valid `excludeFiles` not found in %s'), path);
    }

    done();
}

// The default filesets that are used can be overridden from the command line by
// providing a configuration file with the new filesets defined. The existence
// of the configuration file is checked before the new filesets are defined.

function checkFilesets(done) {
    /* jshint sub: true */
    if (options['filesets']) {
        checkPath(options['filesets'], setFilesets, done);
    } else {
        done();
    }
    /* jshint sub: false */
}

// Run the actual reports. The plato reports are run first, then the JSHint
// report. The output is annotated with headers and details on where the reports
// are stored.

function runReports(err) {
    if (err) { console.log(chalk.red('Error running reports: %s'), err); }

    var excludes = filesets.platoExcludes();

    if (excludes) {
        platoOptions.exclude = excludes;
    }

    jsHintOptions.ignore = filesets.jshintExcludes();
    jsHintOptions.reporter = reporter.reporter;

    console.log(chalk.blue('Building plato reports...'));
    console.log(chalk.gray('(Ignore any output about being unable to parse ' +
        'JSON files)'));

    plato.inspect(filesets.platoIncludes(), outputDir, platoOptions,
        function() {
            console.log(chalk.blue('\nPlato reports have been built to: ') +
                chalk.magenta(outputDir));
            console.log(chalk.blue('\nJSHint Report\n=============\n'));
            buildJSHint(filesets.jshintIncludes(), jsHintOptions,
                reporter.callback);
        }
    );
}

// Provide options to override all the defaults from the command line

getopt = new Getopt([
    ['t', 'title=TITLE', 'The title of the report.'],
    ['o', 'output=PATH', 'The directory to output the reports to'],
    ['l', 'jshint=PATH', 'Path to a jshintrc file for JSHint linting.'],
    ['f', 'filesets=PATH',
     'Path to a file containing the filesets to report on.'],
    ['h', 'help', 'display this help text.']
]);

getopt.setHelp("Usage: node report.js [options]\n[[OPTIONS]]");
getopt.bindHelp();

// Override defaults with any options from the command line, then run the
// reports.

options = getopt.parseSystem().options;

if (options.title) {
    platoOptions.title = options.title;
}

if (options.output) {
    outputDir = options.output;
}

async.parallel([checkJSHint, checkFilesets], runReports);

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