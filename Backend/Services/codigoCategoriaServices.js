import CodigoCategoriaModel from '../Models/codigoCategoriaModels.js';

class CodigoCategoriaService {

  async addCodigoToCategoria(codigoId, categoriaId) {
    try {
      if (!codigoId || !categoriaId) {
        throw new Error('codigoId y categoriaId son requeridos');
      }
      return await CodigoCategoriaModel.addCodigoToCategoria(codigoId, categoriaId);
    } catch (error) {
      console.error('Error en service addCodigoToCategoria:', error);
      throw error;
    }
  }

  async removeCodigoFromCategoria(codigoId, categoriaId) {
    try {
      if (!codigoId || !categoriaId) {
        throw new Error('codigoId y categoriaId son requeridos');
      }
      return await CodigoCategoriaModel.removeCodigoFromCategoria(codigoId, categoriaId);
    } catch (error) {
      console.error('Error en service removeCodigoFromCategoria:', error);
      throw error;
    }
  }

  async getCategoriasFromCodigo(codigoId) {
    try {
      if (!codigoId) {
        throw new Error('codigoId es requerido');
      }
      const categorias = await CodigoCategoriaModel.getCategoriasFromCodigo(codigoId);
      return categorias;
    } catch (error) {
      console.error('Error en service getCategoriasFromCodigo:', error);
      throw error;
    }
  }

  async getCodigosFromCategoria(categoriaId) {
    try {
      if (!categoriaId) {
        throw new Error('categoriaId es requerido');
      }
      const codigos = await CodigoCategoriaModel.getCodigosFromCategoria(categoriaId);
      return codigos;
    } catch (error) {
      console.error('Error en service getCodigosFromCategoria:', error);
      throw error;
    }
  }

}

export default new CodigoCategoriaService();
