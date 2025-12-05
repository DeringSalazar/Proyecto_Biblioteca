import CodigosModel from '../Models/codigosModels.js';
import CollectionsModel from '../Models/collectionsModels.js';

class CodigosService {

  async getCodigosByUser(userId) {
    try {
      const codigos = await CodigosModel.getCodigosByUserId(userId);
      if (!codigos || codigos.length === 0) {
        return [];
      }
      return codigos;
    } catch (error) {
      console.error('Error getting codes by user:', error);
      throw error;
    }
  }

  async getCodigoById(id, userId, userRole) {
    try {
      const codigo = await CodigosModel.getCodigoById(id);
      
      if (!codigo) {
        const error = new Error('Code not found');
        error.code = 'NOT_FOUND';
        throw error;
      }

      // Check if user is the author or admin
      if (codigo.usuario_id !== userId && userRole !== 'admin') {
        const error = new Error('Forbidden');
        error.code = 'FORBIDDEN';
        throw error;
      }

      return codigo;
    } catch (error) {
      console.error('Error getting code by ID:', error);
      throw error;
    }
  }

  async createCodigo(codigoData, userId) {
    try {
      if (!codigoData.titulo || !codigoData.codigo || !codigoData.lenguaje) {
        throw new Error('Required fields: titulo, codigo, lenguaje');
      }

      const codigoToCreate = {
        usuario_id: userId,
        titulo: codigoData.titulo,
        descripcion: codigoData.descripcion,
        codigo: codigoData.codigo,
        lenguaje: codigoData.lenguaje,
        tags: codigoData.tags ? codigoData.tags.join(',') : null,
        tipo: codigoData.tipo
      };

      const createdCodigo = await CodigosModel.createCodigo(codigoToCreate);
      return createdCodigo;
    } catch (error) {
      console.error('Error creating code:', error);
      throw error;
    }
  }

  async updateCodigo(id, codigoData, userId, userRole) {
    try {
      const codigo = await CodigosModel.getCodigoById(id);
      
      if (!codigo) {
        const error = new Error('Code not found');
        error.code = 'NOT_FOUND';
        throw error;
      }

      // Check if user is the author or admin
      if (codigo.usuario_id !== userId && userRole !== 'admin') {
        const error = new Error('Only the author can modify this code');
        error.code = 'FORBIDDEN';
        throw error;
      }

      const codigoToUpdate = {
        titulo: codigoData.titulo || codigo.titulo,
        descripcion: codigoData.descripcion !== undefined ? codigoData.descripcion : codigo.descripcion,
        codigo: codigoData.codigo || codigo.codigo,
        lenguaje: codigoData.lenguaje || codigo.lenguaje,
        tags: codigoData.tags ? codigoData.tags.join(',') : codigo.tags,
        tipo: codigoData.tipo !== undefined ? codigoData.tipo : codigo.tipo
      };

      const updatedCodigo = await CodigosModel.updateCodigo(id, codigoToUpdate);
      return updatedCodigo;
    } catch (error) {
      console.error('Error updating code:', error);
      throw error;
    }
  }

  async deleteCodigo(id, userId, userRole) {
    try {
      const codigo = await CodigosModel.getCodigoById(id);
      
      if (!codigo) {
        const error = new Error('Code not found');
        error.code = 'NOT_FOUND';
        throw error;
      }

      // Check if user is the author or admin
      if (codigo.usuario_id !== userId && userRole !== 'admin') {
        const error = new Error('Only the author can delete this code');
        error.code = 'FORBIDDEN';
        throw error;
      }

      const deleted = await CodigosModel.deleteCodigo(id);
      return deleted;
    } catch (error) {
      console.error('Error deleting code:', error);
      throw error;
    }
  }

  async getCodigosByTag(tag) {
    try {
      const codigos = await CodigosModel.getCodigosByTag(tag);
      return codigos;
    } catch (error) {
      console.error('Error getting codes by tag:', error);
      throw error;
    }
  }

  async addCodigoToColeccion(codigoId, coleccionId, userId, userRole) {
    try {
      const codigo = await CodigosModel.getCodigoById(codigoId);
      if (!codigo) {
        const error = new Error('Code not found');
        error.code = 'NOT_FOUND';
        throw error;
      }

      const coleccion = await CollectionsModel.getCollectionById(coleccionId);
      if (!coleccion) {
        const error = new Error('Collection not found');
        error.code = 'NOT_FOUND';
        throw error;
      }

      // Check if user is the collection owner or admin
      if (coleccion.usuario_id !== userId && userRole !== 'admin') {
        const error = new Error('You can only add codes to your own collections');
        error.code = 'FORBIDDEN';
        throw error;
      }

      const result = await CodigosModel.addCodigoToColeccion(codigoId, coleccionId);
      return result;
    } catch (error) {
      console.error('Error adding code to collection:', error);
      throw error;
    }
  }

  async removeCodigoFromColeccion(codigoId, coleccionId, userId, userRole) {
    try {
      const codigo = await CodigosModel.getCodigoById(codigoId);
      if (!codigo) {
        const error = new Error('Code not found');
        error.code = 'NOT_FOUND';
        throw error;
      }

      const coleccion = await CollectionsModel.getCollectionById(coleccionId);
      if (!coleccion) {
        const error = new Error('Collection not found');
        error.code = 'NOT_FOUND';
        throw error;
      }

      // Check if user is the collection owner or admin
      if (coleccion.usuario_id !== userId && userRole !== 'admin') {
        const error = new Error('You can only remove codes from your own collections');
        error.code = 'FORBIDDEN';
        throw error;
      }

      const deleted = await CodigosModel.removeCodigoFromColeccion(codigoId, coleccionId);
      return deleted;
    } catch (error) {
      console.error('Error removing code from collection:', error);
      throw error;
    }
  }

  async getColeccionesByCodigoId(codigoId, userId, userRole) {
    try {
      const codigo = await CodigosModel.getCodigoById(codigoId);
      if (!codigo) {
        const error = new Error('Code not found');
        error.code = 'NOT_FOUND';
        throw error;
      }

      // Check if user is the author or admin
      if (codigo.usuario_id !== userId && userRole !== 'admin') {
        const error = new Error('Forbidden');
        error.code = 'FORBIDDEN';
        throw error;
      }

      const colecciones = await CodigosModel.getColeccionesByCodigoId(codigoId);
      return colecciones;
    } catch (error) {
      console.error('Error getting collections by code ID:', error);
      throw error;
    }
  }
}

export default new CodigosService();
