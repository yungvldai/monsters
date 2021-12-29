import Router from 'koa-router';
import { getMonster, getStats } from '../controllers/monsters';

const router = Router();

router.get('/:token', getMonster);
router.get('/', getStats);

router.prefix('/monsters');

export default router;
