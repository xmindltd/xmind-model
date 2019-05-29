'use strict';

exports.__esModule = true;
var uuidMap = {};

function UUID(jsonUUID) {

  if (jsonUUID && uuidMap[jsonUUID]) return uuidMap[jsonUUID];

  var toReplacedString = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';

  var newUUID = toReplacedString.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
        v = c === 'x' ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });

  return jsonUUID ? uuidMap[jsonUUID] = newUUID : newUUID;
}

function methodDeprecatedWarn(deprecatedMethod, suggestedMethod) {
  return deprecatedMethod + ' has been deprecated, use ' + suggestedMethod + ' instead';
}

exports.UUID = UUID;
exports.methodDeprecatedWarn = methodDeprecatedWarn;