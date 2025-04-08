import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Hotel, hotelsCollection } from '../models/hotel.model.js';
import { Review } from '../models/review.model.js';

// Obtener las reseñas de un hotel por su ID
export const getReviewsByHotelId = async (req, res) => {
    const { hotelId } = req.params;
    if (!hotelId) {
        return res.status(400).json({ error: 'hotelId inválido' })
    }
    try {
        const hotelSnap = await getDoc(doc(hotelsCollection, hotelId));
        if (!hotelSnap.exists()) {
            return res.status(404).json({ error: 'Hotel no encontrado' });
        }
        const hotel = Hotel.fromFirestore(hotelSnap);
        res.status(200).json(hotel.resenas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las reseñas' });
    }
}

// Agregar una reseña a un hotel
export const createReview = async (req, res) => {
    const { hotelId } = req.params;
    const { usuario, puntuacion, comentario } = req.body;

    // Validaciones
    if (!hotelId || !usuario || !comentario) {
        return res.status(400).json({ error: 'Datos incompletos: usuario, comentario y puntuación son obligatorios' });
    }
    if (typeof puntuacion !== 'number' || puntuacion < 1 || puntuacion > 5) {
        return res.status(400).json({ error: 'La puntuacion debe ser un número del 1 al 5' });
    }
    
    try {
        const hotelRef = doc(hotelsCollection, hotelId);
        const hotelSnap = await getDoc(hotelRef);
        if (!hotelSnap.exists()) {
            return res.status(404).json({ error: 'Hotel no encontrado' });
        }
        const hotel = Hotel.fromFirestore(hotelSnap);
        const newReview = new Review(
            `REV${Date.now()}`,
            hotelId,
            usuario,
            puntuacion,
            comentario,
            new Date().toISOString()
        );
        // Agregar la nueva reseña al arreglo de reseñas del hotel
        hotel.resenas.push(newReview.toFirestore());
        // Calcular el promedio de las puntuaciones
        const totalPuntuacion = hotel.resenas.reduce((acc, review) => acc + review.puntuacion, 0);
        const promedioPuntuacion = hotel.resenas.length > 0 ? totalPuntuacion / hotel.resenas.length : 0;
        // Actualizar el hotel
        await updateDoc(hotelRef, {
            resenas: hotel.resenas,
            stars: promedioPuntuacion,
            updatedAt: new Date().toISOString(),
        });
        const response = newReview.toFirestore();
        res.status(201).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear la reseña' });
    }
};