import express from 'express';
import * as PostController from '../controllers/postController.js';

const router = express.Router();

router.get('/', PostController.getAllPosts);
router.get('/:id', PostController.getPostById);
router.post('/', PostController.createPost);
router.put('/:id', PostController.updatePost);
router.delete('/:id', PostController.deletePost);

export default router;