import express from 'express';
import HotelController from '../controllers/hotel.controller.js';
import { searchHotels, checkRoomAvailability} from '../controllers/special.controller.js'
import { addRoom, listRooms, getRoomDetails, updateRoom, deleteRoom } from '../controllers/room.controller.js';

const router = express.Router(); // Crea una instancia del Router

// Define las rutas
router.get("/", HotelController.getAllHotels);
router.get('/search', searchHotels); 
router.get('/:hotelId/availability',checkRoomAvailability)
router.get("/:id", HotelController.getHotelById);
router.post("/", HotelController.createHotel);
router.put("/:id", HotelController.updateHotel);
router.delete("/:id", HotelController.deleteHotel); // Agrega la ruta DELETE si es necesaria

router.get('/:id/rooms/', listRooms);
router.get('/:id/rooms/:roomId', getRoomDetails);
router.post('/:id/rooms/', addRoom);
router.put('/:id/rooms/:roomId', updateRoom);
router.delete('/:id/rooms/:roomId', deleteRoom);



export default router; // Exporta el router correctamente
