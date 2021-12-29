import { promises as fs } from 'fs';
import path from 'path';

import HTTPStatus from 'src/errors';
import { dbPath, serverUrl } from 'src/config';

const DESC = '**Mosaic Monsters** is an army of 1,024 randomly generated battle monsters in a mosaic world. Visit [this site](https://mosaic.monster) to learn more.';

const getMonster = async (ctx) => {
  const { token } = ctx.params;

  ctx.assert(Boolean(token), HTTPStatus.UNPROCESSABLE_ENTITY, {
    details: 'Token required'
  });

  const metaPath = path.resolve(dbPath, token, 'meta.json');

  try {
    const result = await fs.readFile(metaPath, { encoding: 'utf8' });
    const json = JSON.parse(result);

    if (ctx.query.for_web === 'true') {
      ctx.body = {
        url: `${serverUrl}/${token}`,
        imageUrl: `${serverUrl}/api/v1/files/${token}`,
        ...json
      };

      return;
    }

    ctx.body = {
      attributes: [
        {
          trait_type: 'race',
          value: json.race
        },
        {
          trait_type: 'side',
          value: json.side
        },
        {
          trait_type: 'rarity',
          value: json.rarity
        },
        ...Object.keys(json.attrs).map(attr => ({
          display_type: 'number',
          trait_type: attr,
          value: json.attrs[attr]
        }))
      ],
      description: DESC,
      external_url: `${serverUrl}/${token}`,
      image: `${serverUrl}/api/v1/files/${token}`,
      name: json.name
    };
  } catch (e) {
    console.log(e)

    ctx.throw(HTTPStatus.NOT_FOUND, {
      details: 'Token not found'
    });
  }
}

const getStats = async (ctx) => {
  const statsPath = path.resolve(dbPath, 'stats.json');

  try {
    const result = await fs.readFile(statsPath, { encoding: 'utf8' });
    ctx.body = JSON.parse(result);
  } catch (e) {
    ctx.throw(HTTPStatus.SERVER_ERROR, {
      details: 'Unknown error'
    });
  }
}

export { getMonster, getStats };
