import CodigosService from '../Services/codigosServices.js';

class CodigosController {

  async getMyCodeos(req, res) {
    try {
      const userId = req.user.id_usuario;
      const codigos = await CodigosService.getCodigosByUser(userId);
      return res.status(200).json({
        success: true,
        message: 'Codes obtained correctly',
        codigos: codigos
      });
    } catch (error) {
      console.error('Error en getMyCodeos:', error);
      return res.status(500).json({
        success: false,
        message: 'Error obtaining codes',
        error: error.message
      });
    }
  }

  async getCodigoById(req, res) {
    const { id } = req.params;
    try {
      const userId = req.user.id_usuario;
      const userRole = req.user.rol;

      const codigo = await CodigosService.getCodigoById(id, userId, userRole);
      
      return res.status(200).json({
        success: true,
        message: 'Codigo obtenido correctamente',
        codigo: codigo
      });
    } catch (error) {
      console.error('Error en getCodigoById:', error);
      
      if (error.code === 'NOT_FOUND') {
        return res.status(404).json({
          success: false,
          message: 'Codigo no encontrado',
          error: error.message
        });
      }
      
      if (error.code === 'FORBIDDEN') {
        return res.status(403).json({
          success: false,
          message: 'Acceso denegado al codigo',
          error: error.message
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Error al obtener el codigo',
        error: error.message
      });
    }
  }

  async createCodigo(req, res) {
    try {
      const userId = req.user.id_usuario;
      const { titulo, descripcion, codigo, lenguaje, tags, tipo } = req.body;

      if (!titulo || !codigo || !lenguaje) {
        return res.status(400).json({
          success: false,
          message: 'Campos requeridos: titulo, codigo, lenguaje'
        });
      }

      const codigoData = {
        titulo,
        descripcion,
        codigo,
        lenguaje,
        tags,
        tipo
      };

      const createdCodigo = await CodigosService.createCodigo(codigoData, userId);

      return res.status(201).json({
        success: true,
        message: 'Code created successfully',
        codigo: createdCodigo
      });
    } catch (error) {
      console.error('Error in createCodigo:', error);
      return res.status(500).json({
        success: false,
        message: 'Error creating code',
        error: error.message
      });
    }
  }

  async updateCodigo(req, res) {
    const { id } = req.params;
    try {
      const userId = req.user.id_usuario;
      const userRole = req.user.rol;
      const { titulo, descripcion, codigo, lenguaje, tags, tipo } = req.body;

      const codigoData = {
        titulo,
        descripcion,
        codigo,
        lenguaje,
        tags,
        tipo
      };

      const updatedCodigo = await CodigosService.updateCodigo(id, codigoData, userId, userRole);

      return res.status(200).json({
        success: true,
        message: 'Code updated successfully',
        codigo: updatedCodigo
      });
    } catch (error) {
      console.error('Error in updateCodigo:', error);
      
      if (error.code === 'NOT_FOUND') {
        return res.status(404).json({
          success: false,
          message: 'Code not found',
          error: error.message
        });
      }
      
      if (error.code === 'FORBIDDEN') {
        return res.status(403).json({
          success: false,
          message: 'Only the author can modify this code',
          error: error.message
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Error updating code',
        error: error.message
      });
    }
  }

  async deleteCodigo(req, res) {
    const { id } = req.params;
    try {
      const userId = req.user.id_usuario;
      const userRole = req.user.rol;

      const deleted = await CodigosService.deleteCodigo(id, userId, userRole);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Code not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Code deleted successfully'
      });
    } catch (error) {
      console.error('Error in deleteCodigo:', error);
      
      if (error.code === 'NOT_FOUND') {
        return res.status(404).json({
          success: false,
          message: 'Code not found',
          error: error.message
        });
      }
      
      if (error.code === 'FORBIDDEN') {
        return res.status(403).json({
          success: false,
          message: 'Only the author can delete this code',
          error: error.message
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Error deleting code',
        error: error.message
      });
    }
  }

  async getCodigosByTag(req, res) {
    const { tag } = req.params;
    try {
      const codigos = await CodigosService.getCodigosByTag(tag);
      
      return res.status(200).json({
        success: true,
        message: 'Codes obtained correctly',
        codigos: codigos
      });
    } catch (error) {
      console.error('Error in getCodigosByTag:', error);
      return res.status(500).json({
        success: false,
        message: 'Error obtaining codes by tag',
        error: error.message
      });
    }
  }

  async addCodigoToColeccion(req, res) {
    const { codigoId, coleccionId } = req.body;
    try {
      const userId = req.user.id_usuario;
      const userRole = req.user.rol;

      if (!codigoId || !coleccionId) {
        return res.status(400).json({
          success: false,
          message: 'Required fields: codigoId, coleccionId'
        });
      }

      await CodigosService.addCodigoToColeccion(codigoId, coleccionId, userId, userRole);

      return res.status(200).json({
        success: true,
        message: 'Code added to collection successfully'
      });
    } catch (error) {
      console.error('Error in addCodigoToColeccion:', error);
      
      if (error.code === 'NOT_FOUND') {
        return res.status(404).json({
          success: false,
          message: error.message,
          error: error.message
        });
      }
      
      if (error.code === 'FORBIDDEN') {
        return res.status(403).json({
          success: false,
          message: error.message,
          error: error.message
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Error adding code to collection',
        error: error.message
      });
    }
  }

  async removeCodigoFromColeccion(req, res) {
    const { codigoId, coleccionId } = req.body;
    try {
      const userId = req.user.id_usuario;
      const userRole = req.user.rol;

      if (!codigoId || !coleccionId) {
        return res.status(400).json({
          success: false,
          message: 'Required fields: codigoId, coleccionId'
        });
      }

      const deleted = await CodigosService.removeCodigoFromColeccion(codigoId, coleccionId, userId, userRole);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Code not found in collection'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Code removed from collection successfully'
      });
    } catch (error) {
      console.error('Error in removeCodigoFromColeccion:', error);
      
      if (error.code === 'NOT_FOUND') {
        return res.status(404).json({
          success: false,
          message: error.message,
          error: error.message
        });
      }
      
      if (error.code === 'FORBIDDEN') {
        return res.status(403).json({
          success: false,
          message: error.message,
          error: error.message
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Error removing code from collection',
        error: error.message
      });
    }
  }

  async getColeccionesByCodigoId(req, res) {
    const { id } = req.params;
    try {
      const userId = req.user.id_usuario;
      const userRole = req.user.rol;

      const colecciones = await CodigosService.getColeccionesByCodigoId(id, userId, userRole);
      
      return res.status(200).json({
        success: true,
        message: 'Collections obtained correctly',
        colecciones: colecciones
      });
    } catch (error) {
      console.error('Error in getColeccionesByCodigoId:', error);
      
      if (error.code === 'NOT_FOUND') {
        return res.status(404).json({
          success: false,
          message: 'Code not found',
          error: error.message
        });
      }
      
      if (error.code === 'FORBIDDEN') {
        return res.status(403).json({
          success: false,
          message: 'Access denied to this code',
          error: error.message
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Error obtaining collections',
        error: error.message
      });
    }
  }
}

export default new CodigosController();
