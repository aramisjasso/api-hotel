import express from 'express';
import HotelController from '../controllers/hotel.controller';

router.get("/", HotelController.getAllHotels);
router.get("/:id", HotelController.getHotelById);
router.post("/", HotelController.createHotel);
router.put("/:id", HotelController.updateHotel);

module.exports = router;