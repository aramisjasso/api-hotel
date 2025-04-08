// controllers/roomController.js
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Hotel, hotelsCollection } from '../models/hotel.model.js';
import { Room } from '../models/room.model.js';

// POST /hotels/:id/rooms
export const addRoom = async (req, res) => {
  const { id } = req.params;
  const roomData = req.body;

  // Validación básica
  if (!roomData.numero || !roomData.tipo || !roomData.precio) {
    return res.status(400).json({ error: 'Datos incompletos: número, tipo y precio son obligatorios' });
  }

  try {
    const hotelRef = doc(hotelsCollection, id);
    const hotelSnap = await getDoc(hotelRef);

    if (!hotelSnap.exists()) {
      return res.status(404).json({ error: 'Hotel no encontrado' });
    }

    const hotel = Hotel.fromFirestore(hotelSnap);

    // Verificar si el número de habitación ya existe
    const roomExists = hotel.habitaciones.some(room => room.numero === roomData.numero);
    if (roomExists) {
      return res.status(409).json({ error: 'El número de habitación ya está en uso' });
    }

    // Crear y agregar la habitación
    const newRoom = new Room(
      `ROOM${Math.floor(100000 + Math.random() * 900000)}`, // ID de 6 dígitos
      id,
      roomData.numero,
      roomData.tipo,
      roomData.precio,
      roomData.descripcion || '',
      roomData.estado || 'disponible',
      roomData.amenidades || [],
      roomData.reserva || [],
      new Date().toISOString(), // fechaCreacion en ISO
      new Date().toISOString()  // ultimaActualizacion en ISO
    );

    hotel.addRoom(newRoom);
    await updateDoc(hotelRef, {
      habitaciones: hotel.habitaciones,
      updatedAt: new Date().toISOString(), // Actualiza la fecha del hotel en ISO
    });

    // Respuesta con fechas en ISO
    const response = newRoom.toFirestore();
    res.status(201).json({
      ...response,
      fechaCreacion: new Date(response.fechaCreacion).toISOString(),
      ultimaActualizacion: new Date(response.ultimaActualizacion).toISOString(),
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET /hotels/:id/rooms
export const listRooms = async (req, res) => {
  const { id } = req.params;

  try {
    const hotelSnap = await getDoc(doc(hotelsCollection, id));
    if (!hotelSnap.exists()) {
      return res.status(404).json({ error: 'Hotel no encontrado' });
    }

    const hotel = Hotel.fromFirestore(hotelSnap);
    res.status(200).json(hotel.habitaciones);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET /hotels/:id/rooms/:roomId
export const getRoomDetails = async (req, res) => {
  const { id, roomId } = req.params;

  try {
    const hotelSnap = await getDoc(doc(hotelsCollection, id));
    if (!hotelSnap.exists()) {
      return res.status(404).json({ error: 'Hotel no encontrado' });
    }

    const hotel = Hotel.fromFirestore(hotelSnap);
    const room = hotel.getRoom(roomId);

    if (!room) {
      return res.status(404).json({ error: 'Habitación no encontrada' });
    }

    res.status(200).json(room.toFirestore());
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// PUT /hotels/:id/rooms/:roomId
export const updateRoom = async (req, res) => {
  const { id, roomId } = req.params;
  const updateData = req.body;

  try {
    const hotelRef = doc(hotelsCollection, id);
    const hotelSnap = await getDoc(hotelRef);

    if (!hotelSnap.exists()) {
      return res.status(404).json({ error: 'Hotel no encontrado' });
    }

    const hotel = Hotel.fromFirestore(hotelSnap);
    const room = hotel.getRoom(roomId);

    if (!room) {
      return res.status(404).json({ error: 'Habitación no encontrada' });
    }

    // Actualizar solo campos permitidos y fechas en ISO
    const updatedRoom = {
      ...room.toFirestore(),
      ...updateData,
      ultimaActualizacion: new Date().toISOString(), // Fecha actual en ISO
    };

    const success = hotel.updateRoom(roomId, updatedRoom);
    if (!success) {
      return res.status(400).json({ error: 'Error al actualizar la habitación' });
    }

    await updateDoc(hotelRef, {
      habitaciones: hotel.habitaciones,
      updatedAt: new Date().toISOString(), // Fecha del hotel en ISO
    });

    // Respuesta con fechas en ISO
    const response = hotel.getRoom(roomId).toFirestore();
    res.status(200).json({
      ...response,
      fechaCreacion: new Date(response.fechaCreacion).toISOString(),
      ultimaActualizacion: new Date(response.ultimaActualizacion).toISOString(),
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE /hotels/:id/rooms/:roomId
export const deleteRoom = async (req, res) => {
  const { id, roomId } = req.params;

  try {
    const hotelRef = doc(hotelsCollection, id);
    const hotelSnap = await getDoc(hotelRef);

    if (!hotelSnap.exists()) {
      return res.status(404).json({ error: 'Hotel no encontrado' });
    }

    const hotel = Hotel.fromFirestore(hotelSnap);

    // Validar si hay reservas activas (aquí iría tu lógica de reservas)
    if (hotel.getRoom(roomId).estado === 'Reservada') {
      return res.status(409).json({ 
        error: 'No se puede eliminar: la habitación tiene reservas activas (estado: Reservada)'
      });
    }

    const success = hotel.deleteRoom(roomId);
    if (!success) {
      return res.status(404).json({ error: 'Habitación no encontrada' });
    }

    await updateDoc(hotelRef, {
      habitaciones: hotel.habitaciones,
      updatedAt: hotel.updatedAt,
    });

    res.status(204).end();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};