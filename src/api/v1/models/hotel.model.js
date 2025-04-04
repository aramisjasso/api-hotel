import { db } from '../../../config/firebase.config.js';
import { collection } from 'firebase/firestore';

// Aseguramos que 'db' sea válido para pasar a 'collection'
const hotelsCollection = collection(db, 'hotels');

class Hotel {
  constructor(
    id,
    name,
    description,
    direction, // ✅ Corregido: nombre consistente
    email,
    phoneNumber,
    features,
    stars,
    habitaciones = [],
    resenas = [],
    createdAt = new Date(),
    updatedAt = new Date()
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.direction = direction; // ✅ Corregido: antes tenía un error tipográfico
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.features = features;
    this.stars = stars;
    this.habitaciones = habitaciones;
    this.resenas = resenas;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Convierte el objeto a formato Firestore
  toFirestore() {
    return {
      name: this.name,
      description: this.description,
      direction: this.direction,
      email: this.email,
      phoneNumber: this.phoneNumber,
      features: this.features,
      stars: this.stars,
      habitaciones: this.habitaciones,
      resenas: this.resenas,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  // Crea una instancia desde Firestore
  static fromFirestore(doc) {
    const data = doc.data();
    return new Hotel(
      doc.id,
      data.name,
      data.description,
      data.direction,
      data.email,
      data.phoneNumber,
      data.features,
      data.stars,
      data.habitaciones || [],
      data.resenas || [],
      data.createdAt ? new Date(data.createdAt) : new Date(),
      data.updatedAt ? new Date(data.updatedAt) : new Date()
    );
  }
}

export { Hotel, hotelsCollection };
