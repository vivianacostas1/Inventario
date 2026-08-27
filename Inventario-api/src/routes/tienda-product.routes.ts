import { Router } from 'express';
import { TiendaProductController } from '../controllers/tienda-product.controller';

const router = Router();

router.get('/', TiendaProductController.getTiendaProducts);

export default router;