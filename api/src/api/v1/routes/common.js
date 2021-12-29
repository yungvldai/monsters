import Router from 'koa-router';
import { ping } from '../controllers/common';

const router = Router();

router.get('/ping', ping);

router.prefix('/common');

export default router;
