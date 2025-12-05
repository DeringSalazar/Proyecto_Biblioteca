import CodigosService from '../Services/codigosServices.js';

class CodigosController {

  async getMyCodeos(req, res) {
    try {
      const userId = req.user.id_usuario;
      const codigos = await CodigosService.getCodigosByUser(userId);
      return res.status(200).json({
        success: true,
        message: 'Codigo obtenidos correctamente',
        codigos: codigos
      });
    } catch (error) {
      console.error('Error en getMyCodeos:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener los codigos',
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
        message: 'Codigo creado exitosamente',
        codigo: createdCodigo
      });
    } catch (error) {
      console.error('Error en createCodigo:', error);
      return res.status(500).json({
        success: false,
        message: 'Error creando el codigo',
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
        message: 'Codigo actualizado correctamente',
        codigo: updatedCodigo
      });
    } catch (error) {
      console.error('Error en updateCodigo:', error);
      
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
          message: 'solo el autor puede actualizar este codigo',
          error: error.message
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Error actualizando el codigo',
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
          message: 'Codigo no encontrado'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Codigo eliminado correctamente'
      });
    } catch (error) {
      console.error('Error en deleteCodigo:', error);
      
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
          message: 'solo el autor puede eliminar este codigo',
          error: error.message
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Error eliminando el codigo',
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
        message: 'Codigos obtenidos correctamente',
        codigos: codigos
      });
    } catch (error) {
      console.error('Error en getCodigosByTag:', error);
      return res.status(500).json({
        success: false,
        message: 'Error obteniendo los codigos',
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
          message: 'requiere los codigos: codigoId, coleccionId'
        });
      }

      await CodigosService.addCodigoToColeccion(codigoId, coleccionId, userId, userRole);

      return res.status(200).json({
        success: true,
        message: 'Codigo agregado a la coleccion correctamente'
      });
    } catch (error) {
      console.error('Error en addCodigoToColeccion:', error);
      
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
        message: 'Error añadiendo el codigo a la coleccion',
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
          message: 'Campos requeridos: codigoId, coleccionId'
        });
      }

      const deleted = await CodigosService.removeCodigoFromColeccion(codigoId, coleccionId, userId, userRole);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Codigo no encontrado en la coleccion'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Codigo removido de la coleccion correctamente'
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
        message: 'Error removiendo el codigo de la coleccion',
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
        message: 'Colecciones obtenidos correctamente',
        colecciones: colecciones
      });
    } catch (error) {
      console.error('Error en getColeccionesByCodigoId:', error);
      
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
          message: 'Accesso denegado al codigo',
          error: error.message
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Error obteniendo las colecciones del codigo',
        error: error.message
      });
    }
  }
}

export default new CodigosController();
