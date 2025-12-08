import pool from '../Database/db.js';

class CodigoCategoriaModel {

  async addCodigoToCategoria(codigoId, categoriaId) {
    try {
      await pool.execute(
        `CALL sp_codigo_add_categoria(?, ?)`,
        [codigoId, categoriaId]
      );
      return { success: true, message: 'Código agregado a categoría' };
    } catch (error) {
      console.error('Error adding code to category:', error);
      throw error;
    }
  }

  async removeCodigoFromCategoria(codigoId, categoriaId) {
    try {
      await pool.execute(
        `CALL sp_codigo_remove_categoria(?, ?)`,
        [codigoId, categoriaId]
      );
      return { success: true, message: 'Código removido de categoría' };
    } catch (error) {
      console.error('Error removing code from category:', error);
      throw error;
    }
  }

  async getCategoriasFromCodigo(codigoId) {
    try {
      const [rows] = await pool.execute(
        `CALL sp_codigo_get_categorias(?)`,
        [codigoId]
      );
      return Array.isArray(rows) && rows.length > 0 ? rows : [];
    } catch (error) {
      console.error('Error getting categories from code:', error);
      throw error;
    }
  }

  async getCodigosFromCategoria(categoriaId) {
    try {
      const [rows] = await pool.execute(
        `CALL sp_categorias_get_codigos(?)`,
        [categoriaId]
      );
      return Array.isArray(rows) && rows.length > 0 ? rows : [];
    } catch (error) {
      console.error('Error getting codes from category:', error);
      throw error;
    }
  }

}

export default new CodigoCategoriaModel();
