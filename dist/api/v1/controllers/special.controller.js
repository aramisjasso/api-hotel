"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.searchHotels = exports.checkRoomAvailability = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _hotelModel = require("../models/hotel.model.js");
var _firestore = require("firebase/firestore");
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
/**
 * Controlador para buscar hoteles según criterios específicos
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
var searchHotels = exports.searchHotels = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var _req$query, ciudad, estrellas, precioMin, precioMax, amenidades, errors, queryConstraints, hotelsQuery, hotelsSnapshot, filteredHotels, _iterator, _step, _loop, response;
    return _regenerator["default"].wrap(function _callee$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _req$query = req.query, ciudad = _req$query.ciudad, estrellas = _req$query.estrellas, precioMin = _req$query.precioMin, precioMax = _req$query.precioMax, amenidades = _req$query.amenidades; // Convertir amenidades a array si viene como string
          if (amenidades && !Array.isArray(amenidades)) {
            amenidades = [amenidades];
          }

          // Validaciones básicas
          errors = validateParameters(ciudad, estrellas, precioMin, precioMax, amenidades);
          if (!(errors.length > 0)) {
            _context2.next = 6;
            break;
          }
          return _context2.abrupt("return", res.status(400).json({
            error: 'Parámetros inválidos',
            details: errors
          }));
        case 6:
          // Consulta inicial (filtros a nivel hotel)
          queryConstraints = [];
          if (ciudad) {
            queryConstraints.push((0, _firestore.where)('direccion.ciudad', '==', ciudad));
          }
          if (estrellas) {
            queryConstraints.push((0, _firestore.where)('stars', '==', parseInt(estrellas)));
          }
          hotelsQuery = _firestore.query.apply(void 0, [_hotelModel.hotelsCollection].concat(queryConstraints));
          _context2.next = 12;
          return (0, _firestore.getDocs)(hotelsQuery);
        case 12:
          hotelsSnapshot = _context2.sent;
          if (!hotelsSnapshot.empty) {
            _context2.next = 15;
            break;
          }
          return _context2.abrupt("return", res.status(404).json({
            error: 'No se encontraron hoteles con los criterios básicos'
          }));
        case 15:
          // Procesar hoteles y aplicar filtros a nivel habitación
          filteredHotels = [];
          _iterator = _createForOfIteratorHelper(hotelsSnapshot.docs);
          _context2.prev = 17;
          _loop = /*#__PURE__*/_regenerator["default"].mark(function _loop() {
            var doc, hotel, filteredRooms, min, max, hotelCopy;
            return _regenerator["default"].wrap(function _loop$(_context) {
              while (1) switch (_context.prev = _context.next) {
                case 0:
                  doc = _step.value;
                  hotel = _hotelModel.Hotel.fromFirestore(doc); // Filtrar habitaciones por amenidades y precio
                  filteredRooms = (0, _toConsumableArray2["default"])(hotel.habitaciones); // Filtro por amenidades (si se especificaron)
                  if (amenidades && amenidades.length > 0) {
                    console.log(amenidades);
                    filteredRooms = filteredRooms.filter(function (room) {
                      // Verificar que la habitación tenga todas las amenidades solicitadas
                      return amenidades.every(function (amenidad) {
                        return room.amenidades.some(function (a) {
                          return a.toLowerCase().includes(amenidad.toLowerCase());
                        });
                      });
                    });
                  }

                  // Filtro por precio (si se especificó)
                  if (precioMin || precioMax) {
                    min = precioMin ? parseFloat(precioMin) : 0;
                    max = precioMax ? parseFloat(precioMax) : Infinity;
                    filteredRooms = filteredRooms.filter(function (room) {
                      return room.precio >= min && room.precio <= max;
                    });
                  }

                  // Si quedaron habitaciones después de los filtros, incluir el hotel
                  if (filteredRooms.length > 0) {
                    hotelCopy = new _hotelModel.Hotel(hotel.id, hotel.name, hotel.description, hotel.direccion, hotel.email, hotel.phoneNumber, hotel.features, hotel.stars, filteredRooms, hotel.resenas, hotel.createdAt, hotel.updatedAt);
                    filteredHotels.push(hotelCopy);
                  }
                case 6:
                case "end":
                  return _context.stop();
              }
            }, _loop);
          });
          _iterator.s();
        case 20:
          if ((_step = _iterator.n()).done) {
            _context2.next = 24;
            break;
          }
          return _context2.delegateYield(_loop(), "t0", 22);
        case 22:
          _context2.next = 20;
          break;
        case 24:
          _context2.next = 29;
          break;
        case 26:
          _context2.prev = 26;
          _context2.t1 = _context2["catch"](17);
          _iterator.e(_context2.t1);
        case 29:
          _context2.prev = 29;
          _iterator.f();
          return _context2.finish(29);
        case 32:
          if (!(filteredHotels.length === 0)) {
            _context2.next = 34;
            break;
          }
          return _context2.abrupt("return", res.status(404).json({
            error: 'No se encontraron hoteles con los criterios especificados'
          }));
        case 34:
          // Formatear respuesta
          response = filteredHotels.map(function (hotel) {
            return {
              id: hotel.id,
              name: hotel.name,
              description: hotel.description,
              direccion: hotel.direccion,
              stars: hotel.stars,
              habitacionesDisponibles: hotel.habitaciones.length,
              precioMin: Math.min.apply(Math, (0, _toConsumableArray2["default"])(hotel.habitaciones.map(function (room) {
                return room.precio;
              }))),
              precioMax: Math.max.apply(Math, (0, _toConsumableArray2["default"])(hotel.habitaciones.map(function (room) {
                return room.precio;
              }))),
              amenidadesDisponibles: (0, _toConsumableArray2["default"])(new Set(hotel.habitaciones.flatMap(function (room) {
                return room.amenidades;
              })))
            };
          });
          return _context2.abrupt("return", res.status(200).json(response));
        case 38:
          _context2.prev = 38;
          _context2.t2 = _context2["catch"](0);
          console.error('Error en búsqueda de hoteles:', _context2.t2);
          return _context2.abrupt("return", res.status(500).json({
            error: 'Error interno del servidor',
            details: _context2.t2.message
          }));
        case 42:
        case "end":
          return _context2.stop();
      }
    }, _callee, null, [[0, 38], [17, 26, 29, 32]]);
  }));
  return function searchHotels(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

/**
 * Valida los parámetros de búsqueda
 */
function validateParameters(ciudad, estrellas, precioMin, precioMax, amenidades) {
  var errors = [];
  if (ciudad && typeof ciudad !== 'string') {
    errors.push('El parámetro "ciudad" debe ser una cadena de texto');
  }
  if (estrellas && (isNaN(estrellas) || estrellas < 1 || estrellas > 5)) {
    errors.push('El parámetro "estrellas" debe ser un número entero entre 1 y 5');
  }
  if (precioMin && (isNaN(precioMin) || parseFloat(precioMin) < 0)) {
    errors.push('El parámetro "precioMin" debe ser un número válido mayor o igual a 0');
  }
  if (precioMax && (isNaN(precioMax) || parseFloat(precioMax) < 0)) {
    errors.push('El parámetro "precioMax" debe ser un número válido mayor o igual a 0');
  }
  if (precioMin && precioMax && parseFloat(precioMin) > parseFloat(precioMax)) {
    errors.push('El precio mínimo no puede ser mayor que el precio máximo');
  }
  if (amenidades && !Array.isArray(amenidades)) {
    errors.push('El parámetro "amenidades" debe ser un array');
  } else if (amenidades) {
    amenidades.forEach(function (amenidad, index) {
      if (typeof amenidad !== 'string') {
        errors.push("La amenidad en posici\xF3n ".concat(index, " debe ser un string"));
      }
    });
  }
  return errors;
}
var checkRoomAvailability = exports.checkRoomAvailability = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var hotelId, _req$query2, startDate, endDate, start, end, hotelRef, hotelSnap, hotel, requestedDates, d, availableRooms, response;
    return _regenerator["default"].wrap(function _callee2$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          hotelId = req.params.hotelId;
          _req$query2 = req.query, startDate = _req$query2.startDate, endDate = _req$query2.endDate;
          if (!(!startDate || !endDate)) {
            _context3.next = 5;
            break;
          }
          return _context3.abrupt("return", res.status(400).json({
            error: 'Fechas requeridas',
            details: 'Debe proporcionar startDate y endDate en formato ISO 8601'
          }));
        case 5:
          start = new Date(startDate);
          end = new Date(endDate);
          if (!(isNaN(start.getTime()) || isNaN(end.getTime()))) {
            _context3.next = 9;
            break;
          }
          return _context3.abrupt("return", res.status(400).json({
            error: 'Formato de fecha inválido',
            details: 'Las fechas deben estar en formato ISO 8601 (ej: 2023-05-20)'
          }));
        case 9:
          if (!(start >= end)) {
            _context3.next = 11;
            break;
          }
          return _context3.abrupt("return", res.status(400).json({
            error: 'Rango de fechas inválido',
            details: 'La fecha de inicio debe ser anterior a la fecha de fin'
          }));
        case 11:
          hotelRef = (0, _firestore.doc)(_hotelModel.hotelsCollection, hotelId);
          _context3.next = 14;
          return (0, _firestore.getDoc)(hotelRef);
        case 14:
          hotelSnap = _context3.sent;
          if (hotelSnap.exists()) {
            _context3.next = 17;
            break;
          }
          return _context3.abrupt("return", res.status(404).json({
            error: 'Hotel no encontrado',
            details: "No existe un hotel con ID ".concat(hotelId)
          }));
        case 17:
          hotel = _hotelModel.Hotel.fromFirestore(hotelSnap); // Generar array de fechas en el rango solicitado
          requestedDates = [];
          for (d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
            requestedDates.push(new Date(d).toISOString().split('T')[0]);
          }

          // Filtrar habitaciones que NO tienen ninguna fecha reservada dentro del rango solicitado
          availableRooms = hotel.habitaciones.filter(function (room) {
            var reservas = room.reserva || [];

            // Verificamos si hay alguna coincidencia entre fechas reservadas y solicitadas
            var hayConflicto = reservas.some(function (fechaReservada) {
              return requestedDates.includes(fechaReservada);
            });
            return !hayConflicto;
          });
          response = {
            hotelId: hotel.id,
            hotelName: hotel.name,
            checkInDate: startDate,
            checkOutDate: endDate,
            totalAvailableRooms: availableRooms.length,
            availableRoomTypes: {},
            rooms: availableRooms.map(function (room) {
              return {
                roomId: room.roomId,
                type: room.tipo,
                description: room.descripcion,
                price: room.precio,
                amenities: room.amenidades,
                roomNumber: room.numero
              };
            })
          };
          availableRooms.forEach(function (room) {
            if (!response.availableRoomTypes[room.tipo]) {
              response.availableRoomTypes[room.tipo] = {
                count: 0,
                minPrice: room.precio,
                maxPrice: room.precio
              };
            }
            var tipo = response.availableRoomTypes[room.tipo];
            tipo.count++;
            tipo.minPrice = Math.min(tipo.minPrice, room.precio);
            tipo.maxPrice = Math.max(tipo.maxPrice, room.precio);
          });
          return _context3.abrupt("return", res.status(200).json(response));
        case 26:
          _context3.prev = 26;
          _context3.t0 = _context3["catch"](0);
          console.error('Error al verificar disponibilidad:', _context3.t0);
          return _context3.abrupt("return", res.status(500).json({
            error: 'Error interno del servidor',
            details: _context3.t0.message
          }));
        case 30:
        case "end":
          return _context3.stop();
      }
    }, _callee2, null, [[0, 26]]);
  }));
  return function checkRoomAvailability(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();