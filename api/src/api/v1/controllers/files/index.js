import fs from 'fs';
import path from 'path';
import mime from 'mime-types';

import HTTPStatus from 'src/errors';
import { dbPath } from 'src/config';

const getFile = async (ctx) => {
  const { token } = ctx.params;

  ctx.assert(Boolean(token), HTTPStatus.UNPROCESSABLE_ENTITY, {
    details: 'Token required'
  });

  const imagePath = path.resolve(dbPath, token, 'image.png');

  try {
    const mimeType = mime.lookup(imagePath);
    const src = fs.createReadStream(imagePath);
    ctx.response.set("content-type", mimeType);
    ctx.body = src;
  } catch (e) {
    console.log(e)
    ctx.throw(HTTPStatus.NOT_FOUND, {
      details: 'Token not found'
    });
  }
}

export { getFile };
