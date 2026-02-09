
import { Router } from 'express';
import * as productController from '../controllers/productController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.get('/', productController.getProducts);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.patch('/:id/status', productController.toggleProductStatus);
router.delete('/:id', productController.deleteProduct);

export default router;
