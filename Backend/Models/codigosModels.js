import pool from '../Database/db.js';

class CodigosModel {

  async getCodigosByUserId(userId) {
    try {
      const [rows] = await pool.execute(
        `SELECT id, usuario_id, titulo, descripcion, lenguaje, tags, tipo
         FROM codigo
         WHERE usuario_id = ?
         ORDER BY id DESC`,
        [userId]
      );
      return rows;
    } catch (error) {
      console.error('Error finding codes by user ID:', error);
      throw error;
    }
  }

  async getCodigoById(id) {
    try {
      const [rows] = await pool.execute(
        `SELECT id, usuario_id, titulo, descripcion, codigo, lenguaje, tags, tipo
         FROM codigo
         WHERE id = ?`,
        [id]
      );
      return rows[0];
    } catch (error) {
      console.error('Error finding code by ID:', error);
      throw error;
    }
  }

  async createCodigo(codigoData) {
    if (!codigoData) {
      throw new Error("Code data is undefined");
    }
    const { usuario_id, titulo, descripcion, codigo, lenguaje, tags, tipo } = codigoData;
    try {
      const [result] = await pool.execute(
        `INSERT INTO codigo (usuario_id, titulo, descripcion, codigo, lenguaje, tags, tipo)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [usuario_id, titulo, descripcion || null, codigo, lenguaje, tags || null, tipo || null]
      );
      return this.getCodigoById(result.insertId);
    } catch (error) {
      console.error('Error creating code:', error);
      throw error;
    }
  }

  async updateCodigo(id, codigoData) {
    if (!codigoData) {
      throw new Error("Code data is undefined");
    }
    const { titulo, descripcion, codigo, lenguaje, tags, tipo } = codigoData;
    try {
      await pool.execute(
        `UPDATE codigo
         SET titulo = ?, descripcion = ?, codigo = ?, lenguaje = ?, tags = ?, tipo = ?
         WHERE id = ?`,
        [titulo, descripcion || null, codigo, lenguaje, tags || null, tipo || null, id]
      );
      return this.getCodigoById(id);
    } catch (error) {
      console.error('Error updating code:', error);
      throw error;
    }
  }

  async deleteCodigo(id) {
    try {
      // Delete relationships in coleccion_codigo table first
      await pool.execute(
        `DELETE FROM coleccion_codigo WHERE codigo_id = ?`,
        [id]
      );
      
      // Delete the code
      const [result] = await pool.execute(
        `DELETE FROM codigo WHERE id = ?`,
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting code:', error);
      throw error;
    }
  }

  async getCodigosByTag(tag) {
    try {
      const [rows] = await pool.execute(
        `SELECT id, usuario_id, titulo, descripcion, lenguaje, tags, tipo
         FROM codigo
         WHERE FIND_IN_SET(?, tags) > 0`,
        [tag]
      );
      return rows;
    } catch (error) {
      console.error('Error finding codes by tag:', error);
      throw error;
    }
  }

  async addCodigoToColeccion(codigoId, coleccionId) {
    try {
      const [result] = await pool.execute(
        `INSERT INTO coleccion_codigo (coleccion_id, codigo_id, fecha_agregado)
         VALUES (?, ?, NOW())
         ON DUPLICATE KEY UPDATE fecha_agregado = NOW()`,
        [coleccionId, codigoId]
      );
      return result;
    } catch (error) {
      console.error('Error adding code to collection:', error);
      throw error;
    }
  }

  async removeCodigoFromColeccion(codigoId, coleccionId) {
    try {
      const [result] = await pool.execute(
        `DELETE FROM coleccion_codigo
         WHERE codigo_id = ? AND coleccion_id = ?`,
        [codigoId, coleccionId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error removing code from collection:', error);
      throw error;
    }
  }

  async getColeccionesByCodigoId(codigoId) {
    try {
      const [rows] = await pool.execute(
        `SELECT c.id, c.usuario_id, c.nombre, c.descripcion, c.visibilidad, cc.fecha_agregado
         FROM colecciones c
         INNER JOIN coleccion_codigo cc ON c.id = cc.coleccion_id
         WHERE cc.codigo_id = ?
         ORDER BY cc.fecha_agregado DESC`,
        [codigoId]
      );
      return rows;
    } catch (error) {
      console.error('Error finding collections by code ID:', error);
      throw error;
    }
  }
}

export default new CodigosModel();
