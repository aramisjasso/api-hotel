"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _hotelController = _interopRequireDefault(require("../controllers/hotel.controller.js"));
var _specialController = require("../controllers/special.controller.js");
var _roomController = require("../controllers/room.controller.js");
var _reviewController = require("../controllers/review.controller.js");
var router = _express["default"].Router(); // Crea una instancia del Router

// Define las rutas
router.get("/", _hotelController["default"].getAllHotels);
router.get('/search', _specialController.searchHotels);
router.get('/:hotelId/availability', _specialController.checkRoomAvailability);
router.get("/:id", _hotelController["default"].getHotelById);
router.post("/", _hotelController["default"].createHotel);
router.put("/:id", _hotelController["default"].updateHotel);
router["delete"]("/:id", _hotelController["default"].deleteHotel); // Agrega la ruta DELETE si es necesaria

router.get('/:id/rooms/', _roomController.listRooms);
router.get('/:id/rooms/:roomId', _roomController.getRoomDetails);
router.post('/:id/rooms/', _roomController.addRoom);
router.put('/:id/rooms/:roomId', _roomController.updateRoom);
router["delete"]('/:id/rooms/:roomId', _roomController.deleteRoom);
router.get('/:hotelId/reviews', _reviewController.getReviewsByHotelId);
router.post('/:hotelId/reviews', _reviewController.createReview);
var _default = exports["default"] = router; // Exporta el router correctamente