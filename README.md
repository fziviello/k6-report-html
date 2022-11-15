# K6 Report HTML

### Description

The report will show all request groups, checks, HTTP metrics and other statistics

Any HTTP metrics which have failed thresholds will be highlighted in red. Any group checks with more than 0 failures will also be shown in red.

<a href="https://www.npmjs.com/package/k6-report-html" alt="Latest Stable Version">![npm](https://img.shields.io/npm/v/k6-report-html.svg)</a> <a href="https://www.npmjs.com/package/k6-report-html" alt="Total Downloads">![npm](https://img.shields.io/npm/dw/k6-report-html.svg)</a>

# Npm Usage

```npm
npm i k6-report-html
```

# Locally Usage

This extension to K6 is intended to be used by adding into your K6 test code (JavaScript) and utilizes the _handleSummary_ callback hook, added to K6 last version.
When your test completes a HTML file will be written to the filesystem, containing a formatted and easy to consume version of the test summary data

To use, add this module to your test code.

Import the `reportHTML` function from the bundled module hosted remotely on GitHub

```js
import { reportHTML } from "https://raw.githubusercontent.com/fziviello/k6-report-html/main/dist/reportHtml.min.js";
```

Then outside the test's default function, wrap it with the `handleSummary(data)` function which [K6 calls at the end of any test](https://github.com/loadimpact/k6/pull/1768), as follows:

```js
export function handleSummary(data) {
  return {
    "reports/report.html": reportHTML(data),
  };
}
```

The key used in the returned object is the filename that will be written to, and can be any valid filename or path  

The **reportHTML** function accepts an optional options map as a second parameter, with the following properties

```ts
title    string  // Title of the report, defaults to current date
```

## Merged outputs

If you want more control over the output produced or to output the summary into multiple places (including stdout), just combine the result of reportHTML with other summary generators, as follows:

```js
// This will export to HTML as filename "result.html" AND also stdout using the text summary
import { reportHTML } from "https://raw.githubusercontent.com/fziviello/k6-report-html/main/dist/reportHtml.min.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

export function handleSummary(data) {
  return {
    "reports/report.html": reportHTML(data),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}
```