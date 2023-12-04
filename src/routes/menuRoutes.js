import { Router } from 'express';
const router = Router();
import { getMenu, getItem, addItem, updateItem, deleteItem } from './controllers/menuController';

router.get('/', getMenu);
router.get('/:id', getItem);
router.post('/', addItem);
router.put('/:id', updateItem);
router.delete('/:id', deleteItem);

export default router;
