// A custom _JS Hint_ reporter that will output each Linter message as it's
// found, followed by a summary of each message type and how many times that
// message occurred.

var chalk = require('chalk');

var errors = {};
var totalErrors = 0;

// _JS Hint_ prefixes messages with a letter to determine if it's informational,
// a warning, or an error. By using these the correct log level can be
// determined

function getChalk(code) {
    if (code.slice(0, 1) === 'I') {
        return chalk.blue;
    } else if (code.slice(0, 1) === 'W') {
        return chalk.yellow;
    } else {
        return chalk.red;
    }
}

// The _JS Hint_ reporter displays a formatted line with the level
// determined by _JS Hint_, followed by the evidence for that error.

function reporter(error, file) {

    // _JS Hint_ can sometimes call the reporter function with no error. This is
    // simply ignored.

    if (!error) {
        return;
    }

    if (!(error.code in errors)) {
        errors[error.code] = { reason: error.raw, count: 0 };
    }

    errors[error.code].count++;
    totalErrors++;

    console.log(getChalk(error.code)('%s: line %d, col %d, %s',
        file, error.line, error.character, error.reason));

    if (error.evidence !== undefined) {
        var evidence = error.evidence.trim();
        console.log(chalk.grey('%s', evidence));
    }
}

// The summary output shows the JS Hint error code and the number of times it
// occurred.

function displaySummary(errorCode) {
    var error = errors[errorCode];
    if (error.count > 1) {
        console.log(getChalk(errorCode)('%s: %s (%d instances)',
            errorCode, error.reason, error.count));
    } else {
        console.log(getChalk(errorCode)('%s: %s (1 instance)',
            errorCode, error.reason));
    }
}

// The callback is called when _JS Hint_ has finished parsing all files and is
// used to display a summary of all messages output.

function callback(err, hasError) {

    if (err !== null) {
        console.log(chalk.red('Error running JSHint over project: %j', err));
    }

    if (hasError) {
        console.log('\nSummary\n=======\n');
        for (var errorCode in errors) {
            if (errors.hasOwnProperty(errorCode)) {
                displaySummary(errorCode);
            }
        }

        console.log('');
        console.log(chalk.red('Found %d errors.', totalErrors));
    } else {
        console.log('No JSHint errors found.');
    }
}

module.exports.reporter = reporter;
module.exports.callback = callback;