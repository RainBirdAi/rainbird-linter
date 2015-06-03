# rainbird-linter

[ ![Codeship Status for RainBirdAi/rainbird-linter](https://www.codeship.io/projects/a5b34b90-35a4-0132-be58-5a23f417d8f3/status)](https://www.codeship.io/projects/41124)

Wrapper for JSHint/Plato that produces a JSHint report to the console, and a
Plato report to the filesystem. The reports cover the same filesets and use the
same linter options, although allow for filtering some files from the plato
report.


# Installation

```bash
npm install -g rainbird-linter
```

# Usage

```bash
Usage: rblint [options]
  -t, --title=TITLE    The title of the report.
  -o, --output=PATH    The directory to output the reports to
  -l, --jshint=PATH    Path to a jshintrc file for JSHint linting.
  -f, --filesets=PATH  Path to a file containing the filesets to report on.
  -h, --help           display this help text.
```

The file containing the filesets must be valid JSON containing two properties,
`includeFiles` and `excludeFiles`. Optionally the property `lintOnly` can be
set. Each property is an array of strings containing file or directory names.

## Example

```bash
rblint --title "My Report" --output ~/reports/myproj/ --jshint ~/.jshintrc \
       --filesets ./filesets.json
```

The above command will create a Plato report entitled "My Report" in
`~/reports/myproj/` using a `.jshintrc` from the users home directory. This 
`.jshintrc` will also be used for the linter report to console. The included
files will be pulled from a file called `filesets.json` in the current
directory.

If the contents of `filesets.json` was:

```javascript
{
    "includeFiles": ["index.js", "lib/", "test/", "public/"],
    "excludeFiles": ["public/thirdparty/"],
    "lintOnly": ["public/"]
}
```

The the report would be run over `index.js`, all javascript files under `lib/`,
all javascript files under `test/` and all javascript files under `public/`
apart from the content of `public/thirdparty/`. The contents of `test/` will not
be included in the plato reports.

# Release Notes

## 0.1.8

  * [Fix] Fixes issue where incorrectly stating Node's global modules are
          undefined. Updates node flag to be true.

## 0.1.7

  * [Misc] Lock down node version in `package.json` to avoid problems in the 
           latest version of node and npm.

## 0.1.6
  * [Misc] Lock down the version numbers of any dependencies

## 0.1.5

  * [Misc] Move from expect.js to chai
  * [Misc] Tidy up project structure

## 0.1.4

  *  [New] Ability to add `lintOnly` filter set allowing for de-cluttered plato
           reports while still enforcing linting standards on test code
  *  [New] Added change log/release notes

## Release 0.1.3

  * [Misc] Fix type in release notes filename

## Release 0.1.2

  * [Misc] Set preferGlobal flag to allow rblint command to be properly installed
  * [Misc] Added release notes

## Release 0.1.1

  *  [New] Bind to rblint command
  *  [Fix] Can't use empty filesets
  *  [Fix] Can't run tool from anywhere
  * [Misc] Tidied up documentation

## Release 0.1.0

  * [New] Initial release

# License

Copyright (c) 2014, RainBird Technologies <follow@rainbird.ai>

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
