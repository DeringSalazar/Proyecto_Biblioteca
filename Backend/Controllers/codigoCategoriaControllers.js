import CodigoCategoriaService from '../Services/codigoCategoriaServices.js';

class CodigoCategoriaController {

  async addCodigoToCategoria(req, res) {
    try {
      const { codigoId, categoriaId } = req.body;

      if (!codigoId || !categoriaId) {
        return res.status(400).json({
          success: false,
          message: 'codigoId y categoriaId son requeridos'
        });
      }

      await CodigoCategoriaService.addCodigoToCategoria(codigoId, categoriaId);

      return res.status(200).json({
        success: true,
        message: 'Código agregado a categoría correctamente'
      });
    } catch (error) {
      console.error('Error en controller addCodigoToCategoria:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al agregar código a categoría',
        error: error.message
      });
    }
  }

  async removeCodigoFromCategoria(req, res) {
    try {
      const { codigoId, categoriaId } = req.body;

      if (!codigoId || !categoriaId) {
        return res.status(400).json({
          success: false,
          message: 'codigoId y categoriaId son requeridos'
        });
      }

      await CodigoCategoriaService.removeCodigoFromCategoria(codigoId, categoriaId);

      return res.status(200).json({
        success: true,
        message: 'Código removido de categoría correctamente'
      });
    } catch (error) {
      console.error('Error en controller removeCodigoFromCategoria:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al remover código de categoría',
        error: error.message
      });
    }
  }

  async getCategoriasFromCodigo(req, res) {
    try {
      const { codigoId } = req.params;

      if (!codigoId) {
        return res.status(400).json({
          success: false,
          message: 'codigoId es requerido'
        });
      }

      const categorias = await CodigoCategoriaService.getCategoriasFromCodigo(codigoId);

      return res.status(200).json({
        success: true,
        data: categorias
      });
    } catch (error) {
      console.error('Error en controller getCategoriasFromCodigo:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener categorías del código',
        error: error.message
      });
    }
  }

  async getCodigosFromCategoria(req, res) {
    try {
      const { categoriaId } = req.params;

      if (!categoriaId) {
        return res.status(400).json({
          success: false,
          message: 'categoriaId es requerido'
        });
      }

      const codigos = await CodigoCategoriaService.getCodigosFromCategoria(categoriaId);

      return res.status(200).json({
        success: true,
        data: codigos
      });
    } catch (error) {
      console.error('Error en controller getCodigosFromCategoria:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener códigos de la categoría',
        error: error.message
      });
    }
  }

}

export default new CodigoCategoriaController();
