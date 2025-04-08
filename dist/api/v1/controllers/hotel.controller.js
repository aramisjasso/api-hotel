"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _hotelModel = require("../models/hotel.model.js");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var _require = require('firebase/firestore'),
  doc = _require.doc,
  setDoc = _require.setDoc,
  getDoc = _require.getDoc,
  updateDoc = _require.updateDoc,
  deleteDoc = _require.deleteDoc,
  getDocs = _require.getDocs,
  query = _require.query,
  where = _require.where;
exports.getAllHotels = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var snapshot, hotels;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return getDocs(_hotelModel.hotelsCollection);
        case 3:
          snapshot = _context.sent;
          // Cambiado a getDocs
          hotels = snapshot.docs.map(function (doc) {
            return _objectSpread({
              id: doc.id
            }, doc.data());
          });
          res.status(200).json(hotels);
          _context.next = 11;
          break;
        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);
          res.status(500).json({
            message: "Error al obtener hoteles",
            error: _context.t0
          });
        case 11:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 8]]);
  }));
  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
exports.getHotelById = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var id, docRef, hotelDoc;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          id = req.params.id; // Validar que el ID sea válido
          if (!(!id || typeof id !== 'string' || id.trim() === '')) {
            _context2.next = 4;
            break;
          }
          return _context2.abrupt("return", res.status(400).json({
            error: 'El identificador proporcionado no es válido'
          }));
        case 4:
          docRef = doc(_hotelModel.hotelsCollection, id);
          _context2.next = 7;
          return getDoc(docRef);
        case 7:
          hotelDoc = _context2.sent;
          if (hotelDoc.exists()) {
            _context2.next = 10;
            break;
          }
          return _context2.abrupt("return", res.status(404).json({
            error: 'Hotel no encontrado'
          }));
        case 10:
          res.status(200).json(_objectSpread({
            id: hotelDoc.id
          }, hotelDoc.data()));
          _context2.next = 16;
          break;
        case 13:
          _context2.prev = 13;
          _context2.t0 = _context2["catch"](0);
          res.status(500).json({
            error: 'Error al obtener el hotel',
            details: _context2.t0.message
          });
        case 16:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 13]]);
  }));
  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();
exports.createHotel = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
    var _req$body, id, name, description, direccion, email, phoneNumber, features, stars, _req$body$habitacione, habitaciones, _req$body$resenas, resenas, docRef, docSnap, fechaCreacion, fechaActualizacion, newHotel;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _req$body = req.body, id = _req$body.id, name = _req$body.name, description = _req$body.description, direccion = _req$body.direccion, email = _req$body.email, phoneNumber = _req$body.phoneNumber, features = _req$body.features, stars = _req$body.stars, _req$body$habitacione = _req$body.habitaciones, habitaciones = _req$body$habitacione === void 0 ? [] : _req$body$habitacione, _req$body$resenas = _req$body.resenas, resenas = _req$body$resenas === void 0 ? [] : _req$body$resenas; // Validaciones básicas
          if (!(!id || !name)) {
            _context3.next = 4;
            break;
          }
          return _context3.abrupt("return", res.status(400).json({
            error: 'ID y nombre son requeridos'
          }));
        case 4:
          if (!(!direccion || !direccion.calle || !direccion.ciudad || !direccion.estado || !direccion.codigoPostal || !direccion.pais)) {
            _context3.next = 6;
            break;
          }
          return _context3.abrupt("return", res.status(400).json({
            error: 'La dirección debe contener calle, ciudad, estado, código postal y país'
          }));
        case 6:
          // Verificar si ya existe el hotel
          docRef = doc(_hotelModel.hotelsCollection, id);
          _context3.next = 9;
          return getDoc(docRef);
        case 9:
          docSnap = _context3.sent;
          if (!docSnap.exists()) {
            _context3.next = 12;
            break;
          }
          return _context3.abrupt("return", res.status(409).json({
            error: 'El hotel ya existe'
          }));
        case 12:
          fechaCreacion = new Date().toISOString(); // Guardar la fecha en formato ISO string
          fechaActualizacion = fechaCreacion; // Usar la misma fecha para la actualización
          // Crear el objeto con los datos para Firestore
          newHotel = {
            id: id,
            name: name,
            description: description,
            direccion: direccion,
            email: email,
            phoneNumber: phoneNumber,
            features: features,
            stars: stars,
            habitaciones: habitaciones,
            // No hace falta asignar un valor si ya es un arreglo vacío
            resenas: resenas,
            // No hace falta asignar un valor si ya es un arreglo vacío
            createdAt: fechaCreacion,
            // Fecha como string
            updatedAt: fechaActualizacion // Fecha como string
          }; // Guardar en Firestore
          _context3.next = 17;
          return setDoc(docRef, newHotel);
        case 17:
          // Enviar respuesta
          res.status(201).json({
            id: newHotel.id,
            name: newHotel.name,
            description: newHotel.description,
            direccion: newHotel.direccion,
            email: newHotel.email,
            phoneNumber: newHotel.phoneNumber,
            features: newHotel.features,
            stars: newHotel.stars,
            habitaciones: newHotel.habitaciones,
            resenas: newHotel.resenas,
            createdAt: fechaCreacion,
            updatedAt: fechaActualizacion
          });
          _context3.next = 23;
          break;
        case 20:
          _context3.prev = 20;
          _context3.t0 = _context3["catch"](0);
          res.status(500).json({
            error: _context3.t0.message
          });
        case 23:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 20]]);
  }));
  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();
exports.updateHotel = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res) {
    var id, _req$body2, name, description, direccion, email, phoneNumber, features, stars, docRef, docSnap, fechaActualizacion, updatedData;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          id = req.params.id;
          _req$body2 = req.body, name = _req$body2.name, description = _req$body2.description, direccion = _req$body2.direccion, email = _req$body2.email, phoneNumber = _req$body2.phoneNumber, features = _req$body2.features, stars = _req$body2.stars;
          docRef = doc(_hotelModel.hotelsCollection, id);
          _context4.next = 6;
          return getDoc(docRef);
        case 6:
          docSnap = _context4.sent;
          if (docSnap.exists()) {
            _context4.next = 9;
            break;
          }
          return _context4.abrupt("return", res.status(404).json({
            error: 'Hotel no encontrado'
          }));
        case 9:
          if (!(email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
            _context4.next = 11;
            break;
          }
          return _context4.abrupt("return", res.status(400).json({
            error: 'El formato del correo electrónico no es válido'
          }));
        case 11:
          if (!(phoneNumber && !/^\+?[0-9\s\-]+$/.test(phoneNumber))) {
            _context4.next = 13;
            break;
          }
          return _context4.abrupt("return", res.status(400).json({
            error: 'El formato del número de teléfono no es válido'
          }));
        case 13:
          fechaActualizacion = new Date().toISOString();
          updatedData = _objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, name && {
            name: name
          }), description && {
            description: description
          }), direccion && {
            direccion: direccion
          }), email && {
            email: email
          }), phoneNumber && {
            phoneNumber: phoneNumber
          }), features && {
            features: features
          }), stars && {
            stars: stars
          }), {}, {
            updatedAt: fechaActualizacion
          });
          _context4.next = 17;
          return updateDoc(docRef, updatedData);
        case 17:
          res.status(200).json({
            message: 'Hotel actualizado correctamente',
            updatedData: updatedData
          });
          _context4.next = 23;
          break;
        case 20:
          _context4.prev = 20;
          _context4.t0 = _context4["catch"](0);
          res.status(500).json({
            error: 'Error al actualizar el hotel',
            details: _context4.t0.message
          });
        case 23:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[0, 20]]);
  }));
  return function (_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();
exports.deleteHotel = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res) {
    var id, docRef, docSnap, hotelData, verificacion;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          id = req.params.id;
          docRef = doc(_hotelModel.hotelsCollection, id);
          _context5.next = 5;
          return getDoc(docRef);
        case 5:
          docSnap = _context5.sent;
          if (docSnap.exists()) {
            _context5.next = 8;
            break;
          }
          return _context5.abrupt("return", res.status(404).json({
            error: 'Hotel no encontrado'
          }));
        case 8:
          hotelData = docSnap.data();
          if (!(hotelData.habitaciones && Array.isArray(hotelData.habitaciones))) {
            _context5.next = 13;
            break;
          }
          verificacion = hotelData.habitaciones.some(function (room) {
            return room.estado === 'ocupada' || room.estado === 'reservada';
          });
          if (!verificacion) {
            _context5.next = 13;
            break;
          }
          return _context5.abrupt("return", res.status(409).json({
            error: 'No se puede eliminar el hotel porque tiene habitaciones ocupadas o reservadas.'
          }));
        case 13:
          _context5.next = 15;
          return deleteDoc(docRef);
        case 15:
          res.status(204).send(); // 204 No Content
          _context5.next = 21;
          break;
        case 18:
          _context5.prev = 18;
          _context5.t0 = _context5["catch"](0);
          res.status(500).json({
            error: 'Error al eliminar el hotel',
            details: _context5.t0.message
          });
        case 21:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[0, 18]]);
  }));
  return function (_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();

//module.exports = HotelController;