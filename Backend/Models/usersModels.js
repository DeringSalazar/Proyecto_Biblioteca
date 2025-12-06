import pool from '../Database/db.js';

const UsersModel = {
  async findByEmail(email) {
    const [rows] = await pool.execute(
      'CALL sp_usuarios_search(?)',
      [email]
    );
    return rows[0][0] || null;
  },

  async findById(id) {
    const [rows] = await pool.execute(
      'SELECT id_usuario, nombre_completo, email, fecha_creacion, rol FROM usuarios WHERE id_usuario = ?',
      [id]
    );
    return rows[0] || null;
  },

  async create({ nombre_completo, email, contrasena, rol }) {
    await pool.execute(
      'CALL sp_usuarios_create(?, ?, ?, ?)',
      [nombre_completo, email, contrasena, rol || 'usuario']
    );

    const [rows] = await pool.execute('SELECT * FROM usuarios ORDER BY id_usuario DESC LIMIT 1');
    return rows[0];
  },

  async update(id, { nombre_completo, email, contrasena, rol }) {
    await pool.execute(
      'CALL sp_usuarios_update(?, ?, ?, ?, ?)',
      [id, nombre_completo, email, contrasena, rol]
    );
    return this.findById(id);
  },

  async delete(id) {
    await pool.execute('CALL sp_usuarios_delete(?)', [id]);
    return true;
  },

  async searchByNameOrEmail(q) {
    const [rows] = await pool.execute('CALL sp_usuarios_search(?)', [q]);
    return rows[0];
  },

  async listAll() {
    const [rows] = await pool.execute('CALL sp_usuarios_getall()');
    return rows[0];
  }
};

export default UsersModel;