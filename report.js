// Run JSHint and Plato over the specified files

var fs = require('fs');
var chalk = require('chalk');
var plato = require('plato');
var Getopt = require('node-getopt');
var buildJSHint = require('build-jshint');

var filesets = require('./lib/filesets.js');
var reporter = require('./lib/reporter.js');

// By default reports are output to `./reports` and given the title of `Plato
// Report`.

var outputDir = './reports';

var jsHintOptions = {};
var platoOptions = {
    title: 'Plato Report',
    recurse: true,
    quiet: true
};

// Check the path provided by the user, prefixing it with `./` if it's not an
// explicitly provided as an absolute or relative path. Valid paths are passed
// to the provided callback.

function checkPath(string, callback) {
    var path = string;
    if (!(/^\.|\//).test(string)) {
        path = './' + string;
    }

    fs.stat(path, function(err) {
        if (err) {
            console.log(chalk.red('Error, cannot open: %s'), string);
            process.exit(1);
        } else {
            callback(path);
        }
    });
}

// Plato uses the `jshintrc` as is, whereas JSHint-Build needs the options
// inserted into its own options.

function setJSHint(path) {
    var opts = require(path);
    platoOptions.jshint = path;
    jsHintOptions.options = opts;
}

// Set the filesets from those defined in the provided configuration file. If
// a given fileset isn't defined then a warning will be output.

function setFilesets(path) {
    var config = require(path);

    /* jshint sub: true */
    var includeFiles = config['includeFiles'];
    var excludeFiles = config['excludeFiles'];
    /* jshint sub: false */

    if (includeFiles) {
        filesets.include(includeFiles);
    } else {
        console.log(chalk.yellow('`includeFiles` not found in %s'), path);
    }

    if (excludeFiles) {
        filesets.exclude(excludeFiles);
    } else {
        console.log(chalk.yellow('`excludeFiles` not found in %s'), path);
    }

}

// The default options can all be overridden from the command line.

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

getopt.on('title', function(argv, options) {
    platoOptions.title = options.title;
});

getopt.on('output', function(argv, options) {
    outputDir = options.output;
});

getopt.on('jshint', function(argv, options) {
    checkPath(options.jshint, setJSHint);
});

getopt.on('filesets', function(argv, options) {
    /* jshint sub: true */
    checkPath(options['filesets'], setFilesets);
    /* jshint sub: false */
});

getopt.parseSystem();

// Finish up the configuration and build the reports, starting with Plato, then
// JS Hint.

platoOptions.exclude = filesets.platoExcludes();
jsHintOptions.ignore = filesets.jshintExcludes();
jsHintOptions.reporter = reporter.reporter;

console.log(chalk.blue('Building plato reports...'));
console.log(chalk.gray('(Ignore any output about being unable to parse JSON ' +
    'files)'));

plato.inspect(filesets.platoIncludes(), outputDir, platoOptions, function() {
    console.log(chalk.blue('\nPlato reports have been built to: ') +
        chalk.magenta(outputDir));
    console.log(chalk.blue('\nJSHint Report\n=============\n'));
    buildJSHint(filesets.jshintIncludes(), jsHintOptions, reporter.callback);
});