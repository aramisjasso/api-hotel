const { 
    doc, 
    setDoc, 
    getDoc, 
    updateDoc, 
    deleteDoc, 
    collection,
    query,
    where,
    getDocs
  } = require('firebase/firestore');
  const { db } = require('../../../config/firebase.config');
  
  // Agregar Habitación a un Hotel
  exports.addRoom = async (req, res) => {
    try {
      const { hotelId } = req.params;
      const roomData = req.body;
      
      // Validaciones básicas
      if (!roomData.numero || !roomData.tipo || !roomData.precio) {
        return res.status(400).json({ error: 'Número, tipo y precio son requeridos' });
      }

    // Verificar si el hotel existe
    const hotelRef = doc(db, 'hotels', hotelId);
    const hotelSnap = await getDoc(hotelRef);
    
    if (!hotelSnap.exists()) {
      return res.status(404).json({ error: 'Hotel no encontrado' });
    }

    // Verificar si ya existe una habitación con el mismo número
    const roomsRef = collection(db, `hotels/${hotelId}/rooms`);
    const q = query(roomsRef, where('numero', '==', roomData.numero));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      return res.status(409).json({ error: 'Ya existe una habitación con este número' });
    }

    // Generar ID único para la habitación
    const roomId = `ROOM${Math.floor(10000 + Math.random() * 90000)}`;
    const fechaCreacion = new Date().toISOString();
    
    const newRoom = {
      roomId,
      hotelId,
      ...roomData,
      estado: 'disponible',
      fechaCreacion,
      ultimaActualizacion: fechaCreacion
    };

    await setDoc(doc(roomsRef, roomId), newRoom);
    
    res.status(201).json(newRoom);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Listar habitaciones de un Hotel
exports.listRooms = async (req, res) => {
  try {
    const { hotelId } = req.params;
    
    // Verificar si el hotel existe
    const hotelRef = doc(db, 'hotels', hotelId);
    const hotelSnap = await getDoc(hotelRef);
    
    if (!hotelSnap.exists()) {
      return res.status(404).json({ error: 'Hotel no encontrado' });
    }

    const roomsRef = collection(db, `hotels/${hotelId}/rooms`);
    const snapshot = await getDocs(roomsRef);
    
    const rooms = snapshot.docs.map(doc => doc.data());
    
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener detalles de una habitación
exports.getRoomDetails = async (req, res) => {
  try {
    const { hotelId, roomId } = req.params;
    
    // Validar IDs
    if (!hotelId || !roomId) {
      return res.status(400).json({ error: 'IDs de hotel y habitación requeridos' });
    }

    // Verificar si el hotel existe
    const hotelRef = doc(db, 'hotels', hotelId);
    const hotelSnap = await getDoc(hotelRef);
    
    if (!hotelSnap.exists()) {
      return res.status(404).json({ error: 'Hotel no encontrado' });
    }

    const roomRef = doc(db, `hotels/${hotelId}/rooms`, roomId);
    const roomSnap = await getDoc(roomRef);
    
    if (!roomSnap.exists()) {
      return res.status(404).json({ error: 'Habitación no encontrada' });
    }
    
    res.status(200).json(roomSnap.data());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar Información de una habitación
exports.updateRoom = async (req, res) => {
  try {
    const { hotelId, roomId } = req.params;
    const updateData = req.body;
    
    // Validar IDs
    if (!hotelId || !roomId) {
      return res.status(400).json({ error: 'IDs de hotel y habitación requeridos' });
    }

    // Verificar si el hotel existe
    const hotelRef = doc(db, 'hotels', hotelId);
    const hotelSnap = await getDoc(hotelRef);
    
    if (!hotelSnap.exists()) {
      return res.status(404).json({ error: 'Hotel no encontrado' });
    }

    const roomRef = doc(db, `hotels/${hotelId}/rooms`, roomId);
    const roomSnap = await getDoc(roomRef);
    
    if (!roomSnap.exists()) {
      return res.status(404).json({ error: 'Habitación no encontrada' });
    }

    // Preparar datos para actualizar
    const updatedData = {
      ...updateData,
      ultimaActualizacion: new Date().toISOString()
    };

    await updateDoc(roomRef, updatedData);
    
    res.status(200).json({ 
      message: 'Habitación actualizada correctamente',
      room: { ...roomSnap.data(), ...updatedData }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar una habitación
exports.deleteRoom = async (req, res) => {
  try {
    const { hotelId, roomId } = req.params;
    
    // Validar IDs
    if (!hotelId || !roomId) {
      return res.status(400).json({ error: 'IDs de hotel y habitación requeridos' });
    }

    // Verificar si el hotel existe
    const hotelRef = doc(db, 'hotels', hotelId);
    const hotelSnap = await getDoc(hotelRef);
    
    if (!hotelSnap.exists()) {
      return res.status(404).json({ error: 'Hotel no encontrado' });
    }

    const roomRef = doc(db, `hotels/${hotelId}/rooms`, roomId);
    const roomSnap = await getDoc(roomRef);
    
    if (!roomSnap.exists()) {
      return res.status(404).json({ error: 'Habitación no encontrada' });
    }

    const roomData = roomSnap.data();
    
    // Verificar si la habitación está ocupada o reservada
    if (roomData.estado === 'ocupada' || roomData.estado === 'reservada') {
      return res.status(409).json({ 
        error: 'No se puede eliminar la habitación porque tiene reservas activas' 
      });
    }

    await deleteDoc(roomRef);
    
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
