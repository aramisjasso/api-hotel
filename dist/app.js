"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _morgan = _interopRequireDefault(require("morgan"));
var _cors = _interopRequireDefault(require("cors"));
var _index = _interopRequireDefault(require("./api/v1/routes/index.js"));
var _config = _interopRequireDefault(require("./config/config.js"));
//MALR: imports Swagger
//import swaggerSpec from './config/swagger.config'; // Import the Swagger config
//import swaggerUI from 'swagger-ui-express';
//MALR: imports Routes

//MALR: imports Middlewares
//MALR: Config para variables de entorno

//MALR: Declaramos la variable app igualandola a express 
var app = (0, _express["default"])();
//MALR: Establece la conexion a la BD 
// import { mongoose } from './config/database.config';
//MALR: Settings
app.set('port', _config["default"].PORT);
//MALR: Middlewares generales
app.use((0, _cors["default"])());
app.use((0, _morgan["default"])('dev'));
app.use(_express["default"].json());
app.use(_express["default"].urlencoded({
  extended: false
}));

//MALR: Routes
var api = _config["default"].API_URL;
//app.get(`${api}`, (req,res)=>{
//res.send(
//    `<h1>RESTful running in root</h1> <p> : <b>${api}/api-docs</b> for more information.</p>`
//);
//})

// Swagger Docs
// Serve Swagger Docs
//app.use(`${config.API_URL}/api-docs`, swaggerUI.serve, swaggerUI.setup(swaggerSpec));
// Middleware para el manejo de errores
(0, _index["default"])(app);
// Export App
var _default = exports["default"] = app;