"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Review = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var Review = exports.Review = /*#__PURE__*/function () {
  function Review(reviewId, hotelId, usuario, puntuacion, comentario) {
    var fechaCreacion = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : new Date();
    (0, _classCallCheck2["default"])(this, Review);
    this.reviewId = reviewId;
    this.hotelId = hotelId;
    this.usuario = usuario;
    this.puntuacion = puntuacion;
    this.comentario = comentario;
    this.fechaCreacion = fechaCreacion;
  }
  // Método que convierte el objeto Review en un objeto plano para guardarlo en Firestore
  return (0, _createClass2["default"])(Review, [{
    key: "toFirestore",
    value: function toFirestore() {
      return {
        reviewId: this.reviewId,
        hotelId: this.hotelId,
        usuario: this.usuario,
        puntuacion: this.puntuacion,
        comentario: this.comentario,
        fechaCreacion: this.fechaCreacion
      };
    }

    // Método que permite reconstruir una instancia de Review desde los datos recuperados de Firestore
  }], [{
    key: "fromFirestore",
    value: function fromFirestore(data) {
      return new Review(data.reviewId, data.hotelId, data.usuario, data.puntuacion, data.comentario, data.fechaCreacion);
    }
  }]);
}();