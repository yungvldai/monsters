import find from './find';
import status from './status';

export default (ctx) => {
  const error = find(ctx.status || status.SERVER_ERROR);
  if (error) {
    ctx.throw(ctx.status);
  }
};
