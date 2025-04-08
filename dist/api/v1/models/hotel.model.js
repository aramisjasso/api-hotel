"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hotelsCollection = exports.Hotel = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _firebaseConfig = require("../../../config/firebase.config.js");
var _firestore = require("firebase/firestore");
var _roomModel = require("./room.model.js");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
// Aseguramos que 'db' sea válido para pasar a 'collection'
var hotelsCollection = exports.hotelsCollection = (0, _firestore.collection)(_firebaseConfig.db, 'hotels');
var Hotel = exports.Hotel = /*#__PURE__*/function () {
  function Hotel(id, name, description, direction,
  // ✅ Corregido: nombre consistente
  email, phoneNumber, features, stars) {
    var habitaciones = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : [];
    var resenas = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : [];
    var createdAt = arguments.length > 10 && arguments[10] !== undefined ? arguments[10] : new Date();
    var updatedAt = arguments.length > 11 && arguments[11] !== undefined ? arguments[11] : new Date();
    (0, _classCallCheck2["default"])(this, Hotel);
    this.id = id;
    this.name = name;
    this.description = description;
    this.direction = direction; // ✅ Corregido: antes tenía un error tipográfico
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.features = features;
    this.stars = stars;
    this.habitaciones = habitaciones;
    this.resenas = resenas;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Convierte el objeto a formato Firestore
  return (0, _createClass2["default"])(Hotel, [{
    key: "toFirestore",
    value: function toFirestore() {
      return {
        name: this.name,
        description: this.description,
        direction: this.direction,
        email: this.email,
        phoneNumber: this.phoneNumber,
        features: this.features,
        stars: this.stars,
        habitaciones: this.habitaciones,
        resenas: this.resenas,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt
      };
    }

    // Crea una instancia desde Firestore
  }, {
    key: "addRoom",
    value:
    // Añadir habitación al array
    function addRoom(room) {
      this.habitaciones.push(room.toFirestore());
      this.updatedAt = new Date();
    }

    // Obtener una habitación por roomId
  }, {
    key: "getRoom",
    value: function getRoom(roomId) {
      var roomData = this.habitaciones.find(function (room) {
        return room.roomId === roomId;
      });
      return roomData ? _roomModel.Room.fromFirestore(roomData) : null;
    }

    // Actualizar una habitación
  }, {
    key: "updateRoom",
    value: function updateRoom(roomId, updatedRoomData) {
      var roomIndex = this.habitaciones.findIndex(function (room) {
        return room.roomId === roomId;
      });
      if (roomIndex === -1) return false;
      this.habitaciones[roomIndex] = _objectSpread(_objectSpread({}, this.habitaciones[roomIndex]), updatedRoomData);
      return true;
    }

    // Eliminar una habitación
  }, {
    key: "deleteRoom",
    value: function deleteRoom(roomId) {
      var initialLength = this.habitaciones.length;
      this.habitaciones = this.habitaciones.filter(function (room) {
        return room.roomId !== roomId;
      });
      if (this.habitaciones.length < initialLength) {
        this.updatedAt = new Date();
        return true;
      }
      return false;
    }
  }], [{
    key: "fromFirestore",
    value: function fromFirestore(doc) {
      var data = doc.data();
      return new Hotel(doc.id, data.name, data.description, data.direction, data.email, data.phoneNumber, data.features, data.stars, data.habitaciones || [], data.resenas || [], data.createdAt ? new Date(data.createdAt) : new Date(), data.updatedAt ? new Date(data.updatedAt) : new Date());
    }
  }]);
}();