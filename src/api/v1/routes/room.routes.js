const express = require('express');
const router = express.Router();
const { listRooms, getRoomDetails, addRoom, updateRoom, deleteRoom } = require('../controllers/room.controller');

router.get('/', listRooms);
router.get('/:roomId', getRoomDetails);
router.post('/', addRoom);
router.put('/:roomId', updateRoom);
router.delete('/:roomId', deleteRoom);

module.exports = router;