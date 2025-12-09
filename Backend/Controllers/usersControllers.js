import UsersService from '../Services/usersServices.js';
import { logEvent } from '../utils/logger.js';

const UsersController = {
  async register(req, res) {
    try {
      const user = await UsersService.createUser(req.body);
      return res.status(201).json(user);
    } catch (err) {
      if (err.code === 'DUPLICATE') return res.status(409).json({ error: err.message });
      return res.status(400).json({ error: err.message });
    }
  },

  async login(req, res) {
    try {
      const { email, contrasena } = req.body;
      const result = await UsersService.login({ email, contrasena });
      if (!result) return res.status(401).json({ error: 'Credenciales inválidas' });
      return res.json(result);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async getProfile(req, res) {
    try {
      const id = req.user.id_usuario;
      const user = await UsersService.getProfile(id);
      if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
      return res.json(user);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async updateProfile(req, res) {
    try {
      const requester = req.user;
      const idToUpdate = req.params.id;
      const updated = await UsersService.updateProfile(requester, idToUpdate, req.body);
      return res.json(updated);
    } catch (err) {
      if (err.code === 'FORBIDDEN') return res.status(403).json({ error: err.message });
      if (err.code === 'DUPLICATE') return res.status(409).json({ error: err.message });
      if (err.code === 'NOT_FOUND') return res.status(404).json({ error: err.message });
      return res.status(400).json({ error: err.message });
    }
  },

  async deleteUser(req, res) {
    try {
      const requester = req.user;
      const id = req.params.id;
      const result = await UsersService.deleteUser(requester, id);
      return res.json(result);
    } catch (err) {
      if (err.code === 'FORBIDDEN') return res.status(403).json({ error: err.message });
      if (err.code === 'NOT_FOUND') return res.status(404).json({ error: err.message });
      return res.status(400).json({ error: err.message });
    }
  },

  async search(req, res) {
    try {
      const q = req.query.q || '';
      const rows = await UsersService.search(q);
      return res.json(rows);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async listAll(req, res) {
    try {
      const rows = await UsersService.listAll(req.user);
      return res.json(rows);
    } catch (err) {
      if (err.code === 'FORBIDDEN') return res.status(403).json({ error: err.message });
      return res.status(500).json({ error: err.message });
    }
  }
};

export default UsersController;
