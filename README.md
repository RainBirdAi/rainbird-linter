# rainbird-linter

Wrapper for JSHint/Plato that produces a JSHint report to the console, and a
Plato report to the filesystem. The reports cover the same filesets and use the
same linter options.


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
    "includeFiles": ["index.js", "lib/", "test/", "public/"],
    "excludeFiles": ["public/thirdparty/"]
```

The the report would be run over `index.js`, all javascript files under `lib/`,
all javascript files under `test/` and all javascript files under `public/`
apart from the content of `public/thirdparty/`.

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