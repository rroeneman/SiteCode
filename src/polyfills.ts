import 'core-js/es6';
import 'core-js/es7/reflect';
import 'hammerjs/hammer';
require('zone.js/dist/zone');
require('core-js/shim');

if (process.env.ENV === 'production') {
  // Production
} else {
  // Development and test
  Error['stackTraceLimit'] = Infinity;
  require('zone.js/dist/long-stack-trace-zone');
}