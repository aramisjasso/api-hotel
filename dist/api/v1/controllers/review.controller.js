"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getReviewsByHotelId = exports.createReview = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _firestore = require("firebase/firestore");
var _hotelModel = require("../models/hotel.model.js");
var _reviewModel = require("../models/review.model.js");
// Obtener las reseñas de un hotel por su ID
var getReviewsByHotelId = exports.getReviewsByHotelId = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var hotelId, hotelSnap, hotel;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          hotelId = req.params.hotelId;
          if (hotelId) {
            _context.next = 3;
            break;
          }
          return _context.abrupt("return", res.status(400).json({
            error: 'hotelId inválido'
          }));
        case 3:
          _context.prev = 3;
          _context.next = 6;
          return (0, _firestore.getDoc)((0, _firestore.doc)(_hotelModel.hotelsCollection, hotelId));
        case 6:
          hotelSnap = _context.sent;
          if (hotelSnap.exists()) {
            _context.next = 9;
            break;
          }
          return _context.abrupt("return", res.status(404).json({
            error: 'Hotel no encontrado'
          }));
        case 9:
          hotel = _hotelModel.Hotel.fromFirestore(hotelSnap);
          res.status(200).json(hotel.resenas);
          _context.next = 17;
          break;
        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](3);
          console.error(_context.t0);
          res.status(500).json({
            error: 'Error al obtener las reseñas'
          });
        case 17:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[3, 13]]);
  }));
  return function getReviewsByHotelId(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

// Agregar una reseña a un hotel
var createReview = exports.createReview = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var hotelId, _req$body, usuario, puntuacion, comentario, hotelRef, hotelSnap, hotel, newReview, totalPuntuacion, promedioPuntuacion, response;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          hotelId = req.params.hotelId;
          _req$body = req.body, usuario = _req$body.usuario, puntuacion = _req$body.puntuacion, comentario = _req$body.comentario; // Validaciones
          if (!(!hotelId || !usuario || !comentario)) {
            _context2.next = 4;
            break;
          }
          return _context2.abrupt("return", res.status(400).json({
            error: 'Datos incompletos: usuario, comentario y puntuación son obligatorios'
          }));
        case 4:
          if (!(typeof puntuacion !== 'number' || puntuacion < 1 || puntuacion > 5)) {
            _context2.next = 6;
            break;
          }
          return _context2.abrupt("return", res.status(400).json({
            error: 'La puntuacion debe ser un número del 1 al 5'
          }));
        case 6:
          _context2.prev = 6;
          hotelRef = (0, _firestore.doc)(_hotelModel.hotelsCollection, hotelId);
          _context2.next = 10;
          return (0, _firestore.getDoc)(hotelRef);
        case 10:
          hotelSnap = _context2.sent;
          if (hotelSnap.exists()) {
            _context2.next = 13;
            break;
          }
          return _context2.abrupt("return", res.status(404).json({
            error: 'Hotel no encontrado'
          }));
        case 13:
          hotel = _hotelModel.Hotel.fromFirestore(hotelSnap);
          newReview = new _reviewModel.Review("REV".concat(Date.now()), hotelId, usuario, puntuacion, comentario, new Date().toISOString()); // Agregar la nueva reseña al arreglo de reseñas del hotel
          hotel.resenas.push(newReview.toFirestore());
          // Calcular el promedio de las puntuaciones
          totalPuntuacion = hotel.resenas.reduce(function (acc, review) {
            return acc + review.puntuacion;
          }, 0);
          promedioPuntuacion = hotel.resenas.length > 0 ? totalPuntuacion / hotel.resenas.length : 0; // Actualizar el hotel
          _context2.next = 20;
          return (0, _firestore.updateDoc)(hotelRef, {
            resenas: hotel.resenas,
            stars: promedioPuntuacion,
            updatedAt: new Date().toISOString()
          });
        case 20:
          response = newReview.toFirestore();
          res.status(201).json(response);
          _context2.next = 28;
          break;
        case 24:
          _context2.prev = 24;
          _context2.t0 = _context2["catch"](6);
          console.error(_context2.t0);
          res.status(500).json({
            message: 'Error al crear la reseña'
          });
        case 28:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[6, 24]]);
  }));
  return function createReview(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();