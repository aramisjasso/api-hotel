import express from 'express';
import HotelController from '../controllers/hotel.controller.js';

const router = express.Router(); // Crea una instancia del Router

// Define las rutas
router.get("/", HotelController.getAllHotels);
router.get("/:id", HotelController.getHotelById);
router.post("/", HotelController.createHotel);
router.put("/:id", HotelController.updateHotel);
router.delete("/:id", HotelController.deleteHotel); // Agrega la ruta DELETE si es necesaria

export default router; // Exporta el router correctamente