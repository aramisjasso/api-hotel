// models/Room.js
class Room {
    constructor(
      roomId,
      hotelId,
      numero,
      tipo,
      precio,
      descripcion,
      estado = "disponible",
      reserva = [],
      amenidades = [],
      fechaCreacion = new Date(),
      ultimaActualizacion = new Date()
    ) {
      this.roomId = roomId;
      this.hotelId = hotelId;
      this.numero = numero;
      this.tipo = tipo;
      this.precio = precio;
      this.descripcion = descripcion;
      this.estado = estado;
      this.reserva = reserva;
      this.amenidades = amenidades;
      this.fechaCreacion = fechaCreacion;
      this.ultimaActualizacion = ultimaActualizacion;
    }
  
    // Convertir a formato Firestore (para guardar en el array)
    toFirestore() {
      return {
        roomId: this.roomId,
        hotelId: this.hotelId,
        numero: this.numero,
        tipo: this.tipo,
        precio: this.precio,
        descripcion: this.descripcion,
        estado: this.estado,
        reserva: this.reserva,
        amenidades: this.amenidades,
        fechaCreacion: this.fechaCreacion,
        ultimaActualizacion: this.ultimaActualizacion
      };
    }
  
    // Crear desde Firestore (para leer)
    static fromFirestore(data) {
      return new Room(
        data.roomId,
        data.hotelId,
        data.numero,
        data.tipo,
        data.precio,
        data.descripcion,
        data.estado,
        data.amenidades,
        data.reserva,
        data.fechaCreacion,
        data.ultimaActualizacion
      );
    }
  }
  
  export { Room };