"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _swaggerJsdoc = _interopRequireDefault(require("swagger-jsdoc"));
var _swaggerDocs = _interopRequireDefault(require("../api/v1/docs/swaggerDocs"));
var swaggerSpec = (0, _swaggerJsdoc["default"])({
  definition: _swaggerDocs["default"],
  apis: [] // No need for individual route files
});
var _default = exports["default"] = swaggerSpec;