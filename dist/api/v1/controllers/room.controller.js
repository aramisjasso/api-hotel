"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateRoom = exports.listRooms = exports.getRoomDetails = exports.deleteRoom = exports.addRoom = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _firestore = require("firebase/firestore");
var _hotelModel = require("../models/hotel.model.js");
var _roomModel = require("../models/room.model.js");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; } // controllers/roomController.js
// POST /hotels/:id/rooms
var addRoom = exports.addRoom = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var id, roomData, hotelRef, hotelSnap, hotel, roomExists, newRoom, response;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          id = req.params.id;
          roomData = req.body; // Validación básica
          if (!(!roomData.numero || !roomData.tipo || !roomData.precio)) {
            _context.next = 4;
            break;
          }
          return _context.abrupt("return", res.status(400).json({
            error: 'Datos incompletos: número, tipo y precio son obligatorios'
          }));
        case 4:
          _context.prev = 4;
          hotelRef = (0, _firestore.doc)(_hotelModel.hotelsCollection, id);
          _context.next = 8;
          return (0, _firestore.getDoc)(hotelRef);
        case 8:
          hotelSnap = _context.sent;
          if (hotelSnap.exists()) {
            _context.next = 11;
            break;
          }
          return _context.abrupt("return", res.status(404).json({
            error: 'Hotel no encontrado'
          }));
        case 11:
          hotel = _hotelModel.Hotel.fromFirestore(hotelSnap); // Verificar si el número de habitación ya existe
          roomExists = hotel.habitaciones.some(function (room) {
            return room.numero === roomData.numero;
          });
          if (!roomExists) {
            _context.next = 15;
            break;
          }
          return _context.abrupt("return", res.status(409).json({
            error: 'El número de habitación ya está en uso'
          }));
        case 15:
          // Crear y agregar la habitación
          newRoom = new _roomModel.Room("ROOM".concat(Math.floor(100000 + Math.random() * 900000)),
          // ID de 6 dígitos
          id, roomData.numero, roomData.tipo, roomData.precio, roomData.descripcion || '', roomData.estado || 'disponible', roomData.reserva || [], roomData.amenidades || [], new Date().toISOString(),
          // fechaCreacion en ISO
          new Date().toISOString() // ultimaActualizacion en ISO
          );
          hotel.addRoom(newRoom);
          _context.next = 19;
          return (0, _firestore.updateDoc)(hotelRef, {
            habitaciones: hotel.habitaciones,
            updatedAt: new Date().toISOString() // Actualiza la fecha del hotel en ISO
          });
        case 19:
          // Respuesta con fechas en ISO
          response = newRoom.toFirestore();
          res.status(201).json(_objectSpread(_objectSpread({}, response), {}, {
            fechaCreacion: new Date(response.fechaCreacion).toISOString(),
            ultimaActualizacion: new Date(response.ultimaActualizacion).toISOString()
          }));
          _context.next = 26;
          break;
        case 23:
          _context.prev = 23;
          _context.t0 = _context["catch"](4);
          res.status(400).json({
            error: _context.t0.message
          });
        case 26:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[4, 23]]);
  }));
  return function addRoom(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

// GET /hotels/:id/rooms
var listRooms = exports.listRooms = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var id, hotelSnap, hotel;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          id = req.params.id;
          _context2.prev = 1;
          _context2.next = 4;
          return (0, _firestore.getDoc)((0, _firestore.doc)(_hotelModel.hotelsCollection, id));
        case 4:
          hotelSnap = _context2.sent;
          if (hotelSnap.exists()) {
            _context2.next = 7;
            break;
          }
          return _context2.abrupt("return", res.status(404).json({
            error: 'Hotel no encontrado'
          }));
        case 7:
          hotel = _hotelModel.Hotel.fromFirestore(hotelSnap);
          res.status(200).json(hotel.habitaciones);
          _context2.next = 14;
          break;
        case 11:
          _context2.prev = 11;
          _context2.t0 = _context2["catch"](1);
          res.status(400).json({
            error: _context2.t0.message
          });
        case 14:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[1, 11]]);
  }));
  return function listRooms(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

// GET /hotels/:id/rooms/:roomId
var getRoomDetails = exports.getRoomDetails = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
    var _req$params, id, roomId, hotelSnap, hotel, room;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _req$params = req.params, id = _req$params.id, roomId = _req$params.roomId;
          _context3.prev = 1;
          _context3.next = 4;
          return (0, _firestore.getDoc)((0, _firestore.doc)(_hotelModel.hotelsCollection, id));
        case 4:
          hotelSnap = _context3.sent;
          if (hotelSnap.exists()) {
            _context3.next = 7;
            break;
          }
          return _context3.abrupt("return", res.status(404).json({
            error: 'Hotel no encontrado'
          }));
        case 7:
          hotel = _hotelModel.Hotel.fromFirestore(hotelSnap);
          room = hotel.getRoom(roomId);
          if (room) {
            _context3.next = 11;
            break;
          }
          return _context3.abrupt("return", res.status(404).json({
            error: 'Habitación no encontrada'
          }));
        case 11:
          res.status(200).json(room.toFirestore());
          _context3.next = 17;
          break;
        case 14:
          _context3.prev = 14;
          _context3.t0 = _context3["catch"](1);
          res.status(400).json({
            error: _context3.t0.message
          });
        case 17:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[1, 14]]);
  }));
  return function getRoomDetails(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

// PUT /hotels/:id/rooms/:roomId
var updateRoom = exports.updateRoom = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res) {
    var _req$params2, id, roomId, updateData, hotelRef, hotelSnap, hotel, room, updatedRoom, success, response;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _req$params2 = req.params, id = _req$params2.id, roomId = _req$params2.roomId;
          updateData = req.body;
          _context4.prev = 2;
          hotelRef = (0, _firestore.doc)(_hotelModel.hotelsCollection, id);
          _context4.next = 6;
          return (0, _firestore.getDoc)(hotelRef);
        case 6:
          hotelSnap = _context4.sent;
          if (hotelSnap.exists()) {
            _context4.next = 9;
            break;
          }
          return _context4.abrupt("return", res.status(404).json({
            error: 'Hotel no encontrado'
          }));
        case 9:
          hotel = _hotelModel.Hotel.fromFirestore(hotelSnap);
          room = hotel.getRoom(roomId);
          if (room) {
            _context4.next = 13;
            break;
          }
          return _context4.abrupt("return", res.status(404).json({
            error: 'Habitación no encontrada'
          }));
        case 13:
          // Actualizar solo campos permitidos y fechas en ISO
          updatedRoom = _objectSpread(_objectSpread(_objectSpread({}, room.toFirestore()), updateData), {}, {
            ultimaActualizacion: new Date().toISOString() // Fecha actual en ISO
          });
          success = hotel.updateRoom(roomId, updatedRoom);
          if (success) {
            _context4.next = 17;
            break;
          }
          return _context4.abrupt("return", res.status(400).json({
            error: 'Error al actualizar la habitación'
          }));
        case 17:
          _context4.next = 19;
          return (0, _firestore.updateDoc)(hotelRef, {
            habitaciones: hotel.habitaciones,
            updatedAt: new Date().toISOString() // Fecha del hotel en ISO
          });
        case 19:
          // Respuesta con fechas en ISO
          response = hotel.getRoom(roomId).toFirestore();
          res.status(200).json(_objectSpread(_objectSpread({}, response), {}, {
            fechaCreacion: new Date(response.fechaCreacion).toISOString(),
            ultimaActualizacion: new Date(response.ultimaActualizacion).toISOString()
          }));
          _context4.next = 26;
          break;
        case 23:
          _context4.prev = 23;
          _context4.t0 = _context4["catch"](2);
          res.status(400).json({
            error: _context4.t0.message
          });
        case 26:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[2, 23]]);
  }));
  return function updateRoom(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

// DELETE /hotels/:id/rooms/:roomId
var deleteRoom = exports.deleteRoom = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res) {
    var _req$params3, id, roomId, hotelRef, hotelSnap, hotel, success;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _req$params3 = req.params, id = _req$params3.id, roomId = _req$params3.roomId;
          _context5.prev = 1;
          hotelRef = (0, _firestore.doc)(_hotelModel.hotelsCollection, id);
          _context5.next = 5;
          return (0, _firestore.getDoc)(hotelRef);
        case 5:
          hotelSnap = _context5.sent;
          if (hotelSnap.exists()) {
            _context5.next = 8;
            break;
          }
          return _context5.abrupt("return", res.status(404).json({
            error: 'Hotel no encontrado'
          }));
        case 8:
          hotel = _hotelModel.Hotel.fromFirestore(hotelSnap); // Validar si hay reservas activas (aquí iría tu lógica de reservas)
          if (!(hotel.getRoom(roomId).estado === 'Reservada')) {
            _context5.next = 11;
            break;
          }
          return _context5.abrupt("return", res.status(409).json({
            error: 'No se puede eliminar: la habitación tiene reservas activas (estado: Reservada)'
          }));
        case 11:
          success = hotel.deleteRoom(roomId);
          if (success) {
            _context5.next = 14;
            break;
          }
          return _context5.abrupt("return", res.status(404).json({
            error: 'Habitación no encontrada'
          }));
        case 14:
          _context5.next = 16;
          return (0, _firestore.updateDoc)(hotelRef, {
            habitaciones: hotel.habitaciones,
            updatedAt: hotel.updatedAt
          });
        case 16:
          res.status(204).end();
          _context5.next = 22;
          break;
        case 19:
          _context5.prev = 19;
          _context5.t0 = _context5["catch"](1);
          res.status(400).json({
            error: _context5.t0.message
          });
        case 22:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[1, 19]]);
  }));
  return function deleteRoom(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();