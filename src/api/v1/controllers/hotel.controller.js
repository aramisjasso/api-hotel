import { Hotel, hotelsCollection } from '../models/hotel.model.js';

const { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where 
} = require('firebase/firestore');


exports.getAllHotels = async (req, res) => {
    try {
      const snapshot = await getDocs(hotelsCollection); // Cambiado a getDocs
      const hotels = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      res.status(200).json(hotels);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener hoteles", error });
    }
  };

  exports.getHotelById = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Validar que el ID sea válido
      if (!id || typeof id !== 'string' || id.trim() === '') {
        return res.status(400).json({ error: 'El identificador proporcionado no es válido' });
      }
  
      const docRef = doc(hotelsCollection, id);
      const hotelDoc = await getDoc(docRef);
  
      if (!hotelDoc.exists()) {
        return res.status(404).json({ error: 'Hotel no encontrado' });
      }
  
      res.status(200).json({ id: hotelDoc.id, ...hotelDoc.data() });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el hotel', details: error.message });
    }
  };

  exports.createHotel = async (req, res) => {
    try {
      const { 
        id, 
        name, 
        description, 
        direccion, 
        email, 
        phoneNumber, 
        features, 
        stars, 
        habitaciones = [],  // Default a un arreglo vacío si no se pasa
        resenas = []         // Default a un arreglo vacío si no se pasa
      } = req.body;
      
      // Validaciones básicas
      if (!id || !name) {
        return res.status(400).json({ error: 'ID y nombre son requeridos' });
      }
  
      // Validar la dirección
      if (
        !direccion ||
        !direccion.calle ||
        !direccion.ciudad ||
        !direccion.estado ||
        !direccion.codigoPostal ||
        !direccion.pais
      ) {
        return res.status(400).json({ error: 'La dirección debe contener calle, ciudad, estado, código postal y país' });
      }
  
      // Verificar si ya existe el hotel
      const docRef = doc(hotelsCollection, id);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        return res.status(409).json({ error: 'El hotel ya existe' });
      }
  
      const fechaCreacion = new Date().toISOString();  // Guardar la fecha en formato ISO string
      const fechaActualizacion = fechaCreacion;  // Usar la misma fecha para la actualización
  
      // Crear el objeto con los datos para Firestore
      const newHotel = {
        id,
        name,
        description,
        direccion,
        email,
        phoneNumber,
        features,
        stars,
        habitaciones,  // No hace falta asignar un valor si ya es un arreglo vacío
        resenas,        // No hace falta asignar un valor si ya es un arreglo vacío
        createdAt: fechaCreacion,  // Fecha como string
        updatedAt: fechaActualizacion,  // Fecha como string
      };
  
      // Guardar en Firestore
      await setDoc(docRef, newHotel);
  
      // Enviar respuesta
      res.status(201).json({
        id: newHotel.id,
        name: newHotel.name,
        description: newHotel.description,
        direccion: newHotel.direccion,
        email: newHotel.email,
        phoneNumber: newHotel.phoneNumber,
        features: newHotel.features,
        stars: newHotel.stars,
        habitaciones: newHotel.habitaciones,
        resenas: newHotel.resenas,
        createdAt: fechaCreacion,
        updatedAt: fechaActualizacion,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  
  

exports.updateHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, direccion, email, phoneNumber, features, stars } = req.body;

    const docRef = doc(hotelsCollection, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return res.status(404).json({ error: 'Hotel no encontrado' });
    }

    // Validaciones de datos
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'El formato del correo electrónico no es válido' });
    }

    if (phoneNumber && !/^\+?[0-9\s\-]+$/.test(phoneNumber)) {
      return res.status(400).json({ error: 'El formato del número de teléfono no es válido' });
    }

    const fechaActualizacion = new Date().toISOString();
    const updatedData = {
      ...(name && { name }),
      ...(description && { description }),
      ...(direccion && { direccion }),
      ...(email && { email }),
      ...(phoneNumber && { phoneNumber }),
      ...(features && { features }),
      ...(stars && { stars }),
      updatedAt: fechaActualizacion,
    };

    await updateDoc(docRef, updatedData);

    res.status(200).json({ message: 'Hotel actualizado correctamente', updatedData });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el hotel', details: error.message });
  }
};

exports.deleteHotel = async (req, res) => {
  try {
    const { id } = req.params;

    const docRef = doc(hotelsCollection, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return res.status(404).json({ error: 'Hotel no encontrado' });
    }

    const hotelData = docSnap.data();

    if (hotelData.habitaciones && Array.isArray(hotelData.habitaciones)) {
      const verificacion = hotelData.habitaciones.some(
        (room) => room.estado === 'ocupada' || room.estado === 'reservada'
      );

      if (verificacion) {
        return res.status(409).json({
          error: 'No se puede eliminar el hotel porque tiene habitaciones ocupadas o reservadas.',
        });
      }
    }

    await deleteDoc(docRef);
    res.status(204).send(); // 204 No Content
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el hotel', details: error.message });
  }
};



//module.exports = HotelController;