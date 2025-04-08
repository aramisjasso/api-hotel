import { Hotel, hotelsCollection } from '../models/hotel.model.js';
import { query, where, getDocs, doc, getDoc} from 'firebase/firestore';

/**
 * Controlador para buscar hoteles según criterios específicos
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
export const searchHotels = async (req, res) => {
    try {
      let { ciudad, estrellas, precioMin, precioMax, amenidades } = req.query;
      
      // Convertir amenidades a array si viene como string
      if (amenidades && !Array.isArray(amenidades)) {
        amenidades = [amenidades];
      }
      
      // Validaciones básicas
      const errors = validateParameters(ciudad, estrellas, precioMin, precioMax, amenidades);
      if (errors.length > 0) {
        return res.status(400).json({ error: 'Parámetros inválidos', details: errors });
      }
  
      // Consulta inicial (filtros a nivel hotel)
      let queryConstraints = [];
      
      if (ciudad) {
        queryConstraints.push(where('direccion.ciudad', '==', ciudad));
      }
      
      if (estrellas) {
        queryConstraints.push(where('stars', '==', parseInt(estrellas)));
      }
  
      const hotelsQuery = query(hotelsCollection, ...queryConstraints);
      const hotelsSnapshot = await getDocs(hotelsQuery);
  
      if (hotelsSnapshot.empty) {
        return res.status(404).json({ error: 'No se encontraron hoteles con los criterios básicos' });
      }
  
      // Procesar hoteles y aplicar filtros a nivel habitación
      let filteredHotels = [];
      
      for (const doc of hotelsSnapshot.docs) {
        const hotel = Hotel.fromFirestore(doc);
        
        // Filtrar habitaciones por amenidades y precio
        let filteredRooms = [...hotel.habitaciones];
        
        // Filtro por amenidades (si se especificaron)
        if (amenidades && amenidades.length > 0) {
            console.log(amenidades)
          filteredRooms = filteredRooms.filter(room => {
            // Verificar que la habitación tenga todas las amenidades solicitadas
            return amenidades.every(amenidad => 
              room.amenidades.some(a => 
                a.toLowerCase().includes(amenidad.toLowerCase())
            ));
          });
        }
  
        // Filtro por precio (si se especificó)
        if (precioMin || precioMax) {
          const min = precioMin ? parseFloat(precioMin) : 0;
          const max = precioMax ? parseFloat(precioMax) : Infinity;
          
          filteredRooms = filteredRooms.filter(room => 
            room.precio >= min && room.precio <= max
          );
        }
  
        // Si quedaron habitaciones después de los filtros, incluir el hotel
        if (filteredRooms.length > 0) {
          const hotelCopy = new Hotel(
            hotel.id,
            hotel.name,
            hotel.description,
            hotel.direccion,
            hotel.email,
            hotel.phoneNumber,
            hotel.features,
            hotel.stars,
            filteredRooms,
            hotel.resenas,
            hotel.createdAt,
            hotel.updatedAt
          );
          filteredHotels.push(hotelCopy);
        }
      }
  
      if (filteredHotels.length === 0) {
        return res.status(404).json({ 
          error: 'No se encontraron hoteles con los criterios especificados' 
        });
      }
  
      // Formatear respuesta
      const response = filteredHotels.map(hotel => ({
        id: hotel.id,
        name: hotel.name,
        description: hotel.description,
        direccion: hotel.direccion,
        stars: hotel.stars,
        habitacionesDisponibles: hotel.habitaciones.length,
        precioMin: Math.min(...hotel.habitaciones.map(room => room.precio)),
        precioMax: Math.max(...hotel.habitaciones.map(room => room.precio)),
        amenidadesDisponibles: [...new Set(
          hotel.habitaciones.flatMap(room => room.amenidades)
        )]
      }));
  
      return res.status(200).json(response);
      
    } catch (error) {
      console.error('Error en búsqueda de hoteles:', error);
      return res.status(500).json({ 
        error: 'Error interno del servidor',
        details: error.message 
      });
    }
};

/**
 * Valida los parámetros de búsqueda
 */
function validateParameters(ciudad, estrellas, precioMin, precioMax, amenidades) {
  const errors = [];
  
  if (ciudad && typeof ciudad !== 'string') {
    errors.push('El parámetro "ciudad" debe ser una cadena de texto');
  }
  
  if (estrellas && (isNaN(estrellas) || estrellas < 1 || estrellas > 5)) {
    errors.push('El parámetro "estrellas" debe ser un número entero entre 1 y 5');
  }
  
  if (precioMin && (isNaN(precioMin) || parseFloat(precioMin) < 0)) {
    errors.push('El parámetro "precioMin" debe ser un número válido mayor o igual a 0');
  }
  
  if (precioMax && (isNaN(precioMax) || parseFloat(precioMax) < 0)) {
    errors.push('El parámetro "precioMax" debe ser un número válido mayor o igual a 0');
  }
  
  if (precioMin && precioMax && parseFloat(precioMin) > parseFloat(precioMax)) {
    errors.push('El precio mínimo no puede ser mayor que el precio máximo');
  }
  
  if (amenidades && !Array.isArray(amenidades)) {
    errors.push('El parámetro "amenidades" debe ser un array');
  } else if (amenidades) {
    amenidades.forEach((amenidad, index) => {
      if (typeof amenidad !== 'string') {
        errors.push(`La amenidad en posición ${index} debe ser un string`);
      }
    });
  }
  
  return errors;
}

export const checkRoomAvailability = async (req, res) => {
  try {
      const { hotelId } = req.params;
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
          return res.status(400).json({
              error: 'Fechas requeridas',
              details: 'Debe proporcionar startDate y endDate en formato ISO 8601'
          });
      }

      const start = new Date(startDate);
      const end = new Date(endDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
          return res.status(400).json({
              error: 'Formato de fecha inválido',
              details: 'Las fechas deben estar en formato ISO 8601 (ej: 2023-05-20)'
          });
      }

      if (start >= end) {
          return res.status(400).json({
              error: 'Rango de fechas inválido',
              details: 'La fecha de inicio debe ser anterior a la fecha de fin'
          });
      }

      const hotelRef = doc(hotelsCollection, hotelId);
      const hotelSnap = await getDoc(hotelRef);

      if (!hotelSnap.exists()) {
          return res.status(404).json({
              error: 'Hotel no encontrado',
              details: `No existe un hotel con ID ${hotelId}`
          });
      }

      const hotel = Hotel.fromFirestore(hotelSnap);

      // Generar array de fechas en el rango solicitado
      const requestedDates = [];
      for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
          requestedDates.push(new Date(d).toISOString().split('T')[0]);
      }

      // Filtrar habitaciones que NO tienen ninguna fecha reservada dentro del rango solicitado
      const availableRooms = hotel.habitaciones.filter(room => {
          const reservas = room.reserva || [];

          // Verificamos si hay alguna coincidencia entre fechas reservadas y solicitadas
          const hayConflicto = reservas.some(fechaReservada =>
              requestedDates.includes(fechaReservada)
          );

          return !hayConflicto;
      });

      const response = {
          hotelId: hotel.id,
          hotelName: hotel.name,
          checkInDate: startDate,
          checkOutDate: endDate,
          totalAvailableRooms: availableRooms.length,
          availableRoomTypes: {},
          rooms: availableRooms.map(room => ({
              roomId: room.roomId,
              type: room.tipo,
              description: room.descripcion,
              price: room.precio,
              amenities: room.amenidades,
              roomNumber: room.numero
          }))
      };

      availableRooms.forEach(room => {
          if (!response.availableRoomTypes[room.tipo]) {
              response.availableRoomTypes[room.tipo] = {
                  count: 0,
                  minPrice: room.precio,
                  maxPrice: room.precio
              };
          }

          const tipo = response.availableRoomTypes[room.tipo];
          tipo.count++;
          tipo.minPrice = Math.min(tipo.minPrice, room.precio);
          tipo.maxPrice = Math.max(tipo.maxPrice, room.precio);
      });

      return res.status(200).json(response);

  } catch (error) {
      console.error('Error al verificar disponibilidad:', error);
      return res.status(500).json({
          error: 'Error interno del servidor',
          details: error.message
      });
  }
};
