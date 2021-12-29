import Router from 'koa-router';
import { getFile } from '../controllers/files';

const router = Router();

router.get('/:token', getFile);

router.prefix('/files');

export default router;
