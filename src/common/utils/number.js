"use strict";

exports.__esModule = true;
// number-precision

function stripNum(num) {
  var precision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 12;

  return +parseFloat(num.toPrecision(precision));
}

exports.stripNum = stripNum;