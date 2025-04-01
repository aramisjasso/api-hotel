const { Hotel, hotelsColection } = require('../models/category.model');
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

const HotelController = {
  // Crear categoría
  createCategory: async (req, res) => {
    try {
      const { id, name, description, image, background ,order } = req.body;
      
      // Validaciones
      if (!id || !name) {
        return res.status(400).json({ error: 'ID and name are required' });
      }

      // Verificar si ya existe
      const docRef = doc(categoriesCollection, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return res.status(409).json({ error: 'Category ID already exists' });
      }

      // Crear nueva categoría
      const newCategory = new Category(id, name, description, image, background, order);
      await setDoc(docRef, newCategory.toFirestore());

      res.status(201).json({
        id: newCategory.id,
        name: newCategory.name,
        description: newCategory.description,
        image: newCategory.image,
        background: newCategory.background,
        order: newCategory.order
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener todas las categorías

  
  
};



module.exports = HotelController;