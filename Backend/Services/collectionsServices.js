import CollectionsModel from '../Models/collectionsModels.js';

class CollectionsService {

  async getCollectionsByUser(userId) {
    if (!userId) {
      throw new Error('Data is missing: userId');
    }
    try {
      return await CollectionsModel.getCollectionsByUserId(userId);
    } catch (error) {
      console.error('Error in collectionsService.getCollectionsByUser:', error);
      throw error;
    }
  }

  async getCollectionById(collectionId, userId, userRole) {
    if (!collectionId) {
      throw new Error('Data is missing: collectionId');
    }

    const collection = await CollectionsModel.getCollectionById(collectionId);
    
    if (!collection) {
      const err = new Error('Colección no encontrada');
      err.code = 'NOT_FOUND';
      throw err;
    }

    if (collection.visibilidad === 'privada' && 
        collection.usuario_id !== userId && 
        userRole !== 'admin') {
      const err = new Error('No tienes permiso para ver esta colección');
      err.code = 'FORBIDDEN';
      throw err;
    }

    return collection;
  }

  async createCollection(userId, data) {
    const { nombre, descripcion, visibilidad } = data;

    if (!nombre || nombre.trim() === '') {
      throw new Error('Data is missing: nombre');
    }

    const validVisibilities = ['publica', 'privada'];
    if (visibilidad && !validVisibilities.includes(visibilidad)) {
      throw new Error("Invalid value for visibilidad. Must be 'publica' or 'privada'");
    }

    const collection = {
      usuario_id: userId,
      nombre: nombre.trim(),
      descripcion: descripcion ? descripcion.trim() : null,
      visibilidad: visibilidad || 'privada'
    };

    const result = await CollectionsModel.createCollection(collection);
    return result;
  }

  async updateCollection(collectionId, userId, userRole, data) {
    if (!collectionId) {
      throw new Error('Data is missing: collectionId');
    }

    const collection = await CollectionsModel.getCollectionById(collectionId);
    
    if (!collection) {
      const err = new Error('Colección no encontrada');
      err.code = 'NOT_FOUND';
      throw err;
    }

    if (collection.usuario_id !== userId && userRole !== 'admin') {
      const err = new Error('No tienes permiso para actualizar esta colección');
      err.code = 'FORBIDDEN';
      throw err;
    }

    const { nombre, descripcion, visibilidad } = data;

    if (!nombre || nombre.trim() === '') {
      throw new Error('Data is missing: nombre');
    }

    const validVisibilities = ['publica', 'privada'];
    if (visibilidad && !validVisibilities.includes(visibilidad)) {
      throw new Error("Invalid value for visibilidad. Must be 'publica' or 'privada'");
    }

    const updatedData = {
      id: collectionId,
      nombre: nombre.trim(),
      descripcion: descripcion ? descripcion.trim() : null,
      visibilidad: visibilidad || collection.visibilidad
    };

    const result = await CollectionsModel.updateCollection(updatedData);
    return result;
  }

  async deleteCollection(collectionId, userId, userRole) {
    if (!collectionId) {
      throw new Error('Data is missing: collectionId');
    }

    const collection = await CollectionsModel.getCollectionById(collectionId);
    
    if (!collection) {
      const err = new Error('Colección no encontrada');
      err.code = 'NOT_FOUND';
      throw err;
    }

    if (collection.usuario_id !== userId && userRole !== 'admin') {
      const err = new Error('No tienes permiso para eliminar esta colección');
      err.code = 'FORBIDDEN';
      throw err;
    }

    const deleted = await CollectionsModel.deleteCollection(collectionId);
    
    if (!deleted) {
      const err = new Error('Error al eliminar la colección');
      err.code = 'DELETE_ERROR';
      throw err;
    }

    return { message: 'Colección eliminada correctamente' };
  }

  async addSnippetToCollection(collectionId, snippetId, userId, userRole) {
    if (!collectionId || !snippetId) {
      throw new Error('Data is missing: collectionId, snippetId');
    }

    const collection = await CollectionsModel.getCollectionById(collectionId);
    
    if (!collection) {
      const err = new Error('Colección no encontrada');
      err.code = 'NOT_FOUND';
      throw err;
    }

    if (collection.usuario_id !== userId && userRole !== 'admin') {
      const err = new Error('No tienes permiso para modificar esta colección');
      err.code = 'FORBIDDEN';
      throw err;
    }

    const exists = await CollectionsModel.snippetExistsInCollection(collectionId, snippetId);
    if (exists) {
      const err = new Error('El snippet ya está en esta colección');
      err.code = 'DUPLICATE';
      throw err;
    }

    const added = await CollectionsModel.addSnippetToCollection(collectionId, snippetId);
    
    if (!added) {
      throw new Error('Error al agregar el snippet a la colección');
    }

    return { message: 'Snippet agregado a la colección correctamente' };
  }

  async removeSnippetFromCollection(collectionId, snippetId, userId, userRole) {
    if (!collectionId || !snippetId) {
      throw new Error('Data is missing: collectionId, snippetId');
    }

    const collection = await CollectionsModel.getCollectionById(collectionId);
    
    if (!collection) {
      const err = new Error('Colección no encontrada');
      err.code = 'NOT_FOUND';
      throw err;
    }

    if (collection.usuario_id !== userId && userRole !== 'admin') {
      const err = new Error('No tienes permiso para modificar esta colección');
      err.code = 'FORBIDDEN';
      throw err;
    }

    const removed = await CollectionsModel.removeSnippetFromCollection(collectionId, snippetId);
    
    if (!removed) {
      const err = new Error('Snippet no encontrado en la colección');
      err.code = 'NOT_FOUND';
      throw err;
    }

    return { message: 'Snippet eliminado de la colección correctamente' };
  }

  async getSnippetsByCollection(collectionId, userId, userRole) {
    if (!collectionId) {
      throw new Error('Data is missing: collectionId');
    }

    const collection = await CollectionsModel.getCollectionById(collectionId);
    
    if (!collection) {
      const err = new Error('Colección no encontrada');
      err.code = 'NOT_FOUND';
      throw err;
    }

    if (collection.visibilidad === 'privada' && 
        collection.usuario_id !== userId && 
        userRole !== 'admin') {
      const err = new Error('No tienes permiso para ver esta colección');
      err.code = 'FORBIDDEN';
      throw err;
    }

    const result = await CollectionsModel.getSnippetsByCollectionId(collectionId);
    return result;
  }
}

export default new CollectionsService();