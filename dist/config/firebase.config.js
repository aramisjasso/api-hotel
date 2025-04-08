"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.db = void 0;
var _app = require("firebase/app");
var _firestore = require("firebase/firestore");
var _config = _interopRequireDefault(require("./config.js"));
// Cambia require por import

console.log('Variables de entorno cargadas:', _config["default"]);
console.log('Configuración de Firebase:', _config["default"]); // Verifica que las credenciales se carguen correctamente

var firebaseConfig = {
  apiKey: _config["default"].FIREBASE_API_KEY,
  authDomain: _config["default"].FIREBASE_AUTH_DOMAIN,
  projectId: _config["default"].FIREBASE_PROJECT_ID,
  storageBucket: _config["default"].FIREBASE_STORAGE_BUCKET,
  messagingSenderId: _config["default"].FIREBASE_MESSAGING_SENDER_ID,
  appId: _config["default"].FIREBASE_APP_ID
};

// Inicializar Firebase
var app = (0, _app.initializeApp)(firebaseConfig);
var db = exports.db = (0, _firestore.getFirestore)(app);
console.log('Firebase inicializado correctamente'); // Verifica que Firebase se inicialice