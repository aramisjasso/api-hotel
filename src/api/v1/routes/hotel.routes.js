import express from 'express';
import HotelController from '../controllers/hotel.controller';

const router = express.Router();
//Crud de categories
router.post('/',HotelController.createCategory);



export default router;