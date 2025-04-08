"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _app = _interopRequireDefault(require("./app.js"));
var _config = _interopRequireDefault(require("./config/config.js"));
_app["default"].listen(_app["default"].get('port'));
console.log("Server is running on: http://".concat(_config["default"].HOST, ":").concat(_app["default"].get('port')).concat(_config["default"].API_URL));