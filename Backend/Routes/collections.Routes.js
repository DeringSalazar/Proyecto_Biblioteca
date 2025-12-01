import { Router } from 'express';
import CollectionsController from '../Controllers/collectionsControllers.js';
import { authMiddleware } from '../Middleware/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/', CollectionsController.getMyCollections);

router.post('/', CollectionsController.createCollection);

router.get('/:id', CollectionsController.getCollectionById);

router.put('/:id', CollectionsController.updateCollection);

router.delete('/:id', CollectionsController.deleteCollection);

router.get('/:id/snippets', CollectionsController.getSnippetsByCollection);

router.post('/:id/snippets', CollectionsController.addSnippetToCollection);

router.delete('/:id/snippets/:snippet_id', CollectionsController.removeSnippetFromCollection);

export default router;