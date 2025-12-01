import CollectionsService from '../Services/collectionsServices.js';

class CollectionsController {

  async getMyCollections(req, res) {
    try {
      const userId = req.user.id_usuario;
      const collections = await CollectionsService.getCollectionsByUser(userId);
      return res.status(200).json({
        success: true,
        message: 'Collections obtained correctly',
        collections: collections
      });
    } catch (error) {
      console.error('Error in getMyCollections:', error);
      return res.status(500).json({
        success: false,
        message: 'Error obtaining collections',
        error: error.message
      });
    }
  }

  async getCollectionById(req, res) {
    const { id } = req.params;
    try {
      const userId = req.user.id_usuario;
      const userRole = req.user.rol;

      const collection = await CollectionsService.getCollectionById(id, userId, userRole);
      
      return res.status(200).json({
        success: true,
        message: 'Collection obtained correctly',
        collection: collection
      });
    } catch (error) {
      console.error('Error in getCollectionById:', error);
      
      if (error.code === 'NOT_FOUND') {
        return res.status(404).json({
          success: false,
          message: 'Collection not found',
          error: error.message
        });
      }
      
      if (error.code === 'FORBIDDEN') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to view this collection',
          error: error.message
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Error obtaining collection',
        error: error.message
      });
    }
  }

  async createCollection(req, res) {
    const { nombre, descripcion, visibilidad } = req.body;
    try {
      const userId = req.user.id_usuario;

      const collection = await CollectionsService.createCollection(userId, {
        nombre,
        descripcion,
        visibilidad
      });

      return res.status(201).json({
        success: true,
        message: 'Collection created correctly',
        collection: collection
      });
    } catch (error) {
      console.error('Error in createCollection:', error);
      
      if (error.message.includes('obligatorio') || error.message.includes('debe ser')) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or missing data',
          error: error.message
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Error creating collection',
        error: error.message
      });
    }
  }
  async updateCollection(req, res) {
    const { id } = req.params;
    const { nombre, descripcion, visibilidad } = req.body;
    try {
      const userId = req.user.id_usuario;
      const userRole = req.user.rol;

      const collection = await CollectionsService.updateCollection(id, userId, userRole, {
        nombre,
        descripcion,
        visibilidad
      });

      return res.status(200).json({
        success: true,
        message: 'Collection updated correctly',
        collection: collection
      });
    } catch (error) {
      console.error('Error in updateCollection:', error);
      
      if (error.code === 'NOT_FOUND') {
        return res.status(404).json({
          success: false,
          message: 'Collection not found',
          error: error.message
        });
      }
      
      if (error.code === 'FORBIDDEN') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to update this collection',
          error: error.message
        });
      }
      
      if (error.message.includes('obligatorio') || error.message.includes('debe ser')) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or missing data',
          error: error.message
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Error updating collection',
        error: error.message
      });
    }
  }

  async deleteCollection(req, res) {
    const { id } = req.params;
    try {
      const userId = req.user.id_usuario;
      const userRole = req.user.rol;

      const result = await CollectionsService.deleteCollection(id, userId, userRole);

      return res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      console.error('Error in deleteCollection:', error);
      
      if (error.code === 'NOT_FOUND') {
        return res.status(404).json({
          success: false,
          message: 'Collection not found',
          error: error.message
        });
      }
      
      if (error.code === 'FORBIDDEN') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to delete this collection',
          error: error.message
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Error deleting collection',
        error: error.message
      });
    }
  }

  async addSnippetToCollection(req, res) {
    const { id } = req.params;
    const { snippet_id } = req.body;
    try {
      const userId = req.user.id_usuario;
      const userRole = req.user.rol;

      if (!snippet_id) {
        return res.status(400).json({
          success: false,
          message: 'Snippet ID is required'
        });
      }

      const result = await CollectionsService.addSnippetToCollection(
        id, 
        snippet_id, 
        userId, 
        userRole
      );

      return res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      console.error('Error in addSnippetToCollection:', error);
      
      if (error.code === 'NOT_FOUND') {
        return res.status(404).json({
          success: false,
          message: 'Collection or snippet not found',
          error: error.message
        });
      }
      
      if (error.code === 'FORBIDDEN') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to modify this collection',
          error: error.message
        });
      }
      
      if (error.code === 'DUPLICATE') {
        return res.status(409).json({
          success: false,
          message: 'The snippet is already in this collection',
          error: error.message
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Error adding snippet to collection',
        error: error.message
      });
    }
  }

  async removeSnippetFromCollection(req, res) {
    const { id, snippet_id } = req.params;
    try {
      const userId = req.user.id_usuario;
      const userRole = req.user.rol;

      const result = await CollectionsService.removeSnippetFromCollection(
        id, 
        snippet_id, 
        userId, 
        userRole
      );

      return res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      console.error('Error in removeSnippetFromCollection:', error);
      
      if (error.code === 'NOT_FOUND') {
        return res.status(404).json({
          success: false,
          message: 'Collection or snippet not found',
          error: error.message
        });
      }
      
      if (error.code === 'FORBIDDEN') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to modify this collection',
          error: error.message
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Error removing snippet from collection',
        error: error.message
      });
    }
  }

  async getSnippetsByCollection(req, res) {
    const { id } = req.params;
    try {
      const userId = req.user.id_usuario;
      const userRole = req.user.rol;

      const snippets = await CollectionsService.getSnippetsByCollection(id, userId, userRole);

      return res.status(200).json({
        success: true,
        message: 'Snippets obtained correctly',
        snippets: snippets
      });
    } catch (error) {
      console.error('Error in getSnippetsByCollection:', error);
      
      if (error.code === 'NOT_FOUND') {
        return res.status(404).json({
          success: false,
          message: 'Collection not found',
          error: error.message
        });
      }
      
      if (error.code === 'FORBIDDEN') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to view this collection',
          error: error.message
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Error obtaining snippets from collection',
        error: error.message
      });
    }
  }
}

export default new CollectionsController();