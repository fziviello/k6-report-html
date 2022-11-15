/*
  Generate report HTML from K6
  Fabio Ziviello, November 2022
*/

import ejs from "ejs/ejs.min.js";
import template from "./template.ejs";
const version = "1.0.0";

export function reportHTML(data, opts = {}) {
  if (!opts.title) {
    opts.title = new Date().toISOString().slice(0, 16).replace("T", " ");
  }

  console.log(`[k6-report-html v${version}] Generating report HTML`);
  let metricListSorted = [];

  if (opts.debug) {
    console.log(JSON.stringify(data, null, 2));
  }

  let thresholdFailures = 0;
  let thresholdCount = 0;
  for (let metricName in data.metrics) {
    metricListSorted.push(metricName);
    if (data.metrics[metricName].thresholds) {
      thresholdCount++;
      let thresholds = data.metrics[metricName].thresholds;
      for (let thresName in thresholds) {
        if (!thresholds[thresName].ok) {
          thresholdFailures++;
        }
      }
    }
  }

  let checkFailures = 0;
  let checkPasses = 0;
  if (data.root_group.checks) {
    let { passes, fails } = countChecks(data.root_group.checks);
    checkFailures += fails;
    checkPasses += passes;
  }

  for (let group of data.root_group.groups) {
    if (group.checks) {
      let { passes, fails } = countChecks(group.checks);
      checkFailures += fails;
      checkPasses += passes;
    }
  }

  const standardMetrics = [
    "grpc_req_duration",
    "http_req_duration",
    "http_req_waiting",
    "http_req_connecting",
    "http_req_tls_handshaking",
    "http_req_sending",
    "http_req_receiving",
    "http_req_blocked",
    "iteration_duration",
    "group_duration",
    "ws_connecting",
    "ws_msgs_received",
    "ws_msgs_sent",
    "ws_sessions",
  ];

  const otherMetrics = [
    "iterations",
    "data_sent",
    "checks",
    "http_reqs",
    "data_received",
    "vus_max",
    "vus",
    "http_req_failed",
    "http_req_duration{expected_response:true}",
  ];

  // Render the template
  const html = ejs.render(template, {
    data,
    title: opts.title,
    standardMetrics,
    otherMetrics,
    thresholdFailures,
    thresholdCount,
    checkFailures,
    checkPasses,
    version,
  });

  // Return HTML string needs wrapping in a handleSummary result object
  // See https://k6.io/docs/results-visualization/end-of-test-summary#handlesummary-callback
  return html;
}

//
// Helper for counting the checks in a group
//
function countChecks(checks) {
  let passes = 0;
  let fails = 0;
  for (let check of checks) {
    passes += parseInt(check.passes);
    fails += parseInt(check.fails);
  }
  return { passes, fails };
}
