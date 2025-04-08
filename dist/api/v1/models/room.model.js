"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Room = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
// models/Room.js
var Room = exports.Room = /*#__PURE__*/function () {
  function Room(roomId, hotelId, numero, tipo, precio, descripcion) {
    var estado = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : "disponible";
    var reserva = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : [];
    var amenidades = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : [];
    var fechaCreacion = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : new Date();
    var ultimaActualizacion = arguments.length > 10 && arguments[10] !== undefined ? arguments[10] : new Date();
    (0, _classCallCheck2["default"])(this, Room);
    this.roomId = roomId;
    this.hotelId = hotelId;
    this.numero = numero;
    this.tipo = tipo;
    this.precio = precio;
    this.descripcion = descripcion;
    this.estado = estado;
    this.reserva = reserva;
    this.amenidades = amenidades;
    this.fechaCreacion = fechaCreacion;
    this.ultimaActualizacion = ultimaActualizacion;
  }

  // Convertir a formato Firestore (para guardar en el array)
  return (0, _createClass2["default"])(Room, [{
    key: "toFirestore",
    value: function toFirestore() {
      return {
        roomId: this.roomId,
        hotelId: this.hotelId,
        numero: this.numero,
        tipo: this.tipo,
        precio: this.precio,
        descripcion: this.descripcion,
        estado: this.estado,
        reserva: this.reserva,
        amenidades: this.amenidades,
        fechaCreacion: this.fechaCreacion,
        ultimaActualizacion: this.ultimaActualizacion
      };
    }

    // Crear desde Firestore (para leer)
  }], [{
    key: "fromFirestore",
    value: function fromFirestore(data) {
      return new Room(data.roomId, data.hotelId, data.numero, data.tipo, data.precio, data.descripcion, data.estado, data.amenidades, data.reserva, data.fechaCreacion, data.ultimaActualizacion);
    }
  }]);
}();