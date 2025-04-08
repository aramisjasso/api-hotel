"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = require("express");
var _config = _interopRequireDefault(require("../../../config/config.js"));
var _hotelRoutes = _interopRequireDefault(require("./hotel.routes.js"));
var routerAPI = function routerAPI(app) {
  var router = (0, _express.Router)();
  var api = _config["default"].API_URL;
  app.use(api, router);
  router.use('/hotels', _hotelRoutes["default"]);
  return router;
};
var _default = exports["default"] = routerAPI;