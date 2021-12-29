import 'core-js/stable';
import 'regenerator-runtime/runtime';

import cliProgress from 'cli-progress';
import { promises as fs } from 'fs';
import Jimp from 'jimp';
import path from 'path';
import { createCanvas } from 'canvas';
import type { Canvas, NodeCanvasRenderingContext2D } from 'canvas';
import hasha from 'hasha';

import createRenderer from './renderer/renderer';
import createMonster from './monster';
import createLocation from './location';
import { SIZE } from './scene';
import Stats from './stats';
import { unique } from './utils';

const amount = Number(process.argv[2]) || 1;
const outDir = process.env.OUT_DIR || 'out';
const prodSize = Number(process.env.SIZE) || 1024;

const run = async () => {
  const canvas: Canvas = createCanvas(SIZE, SIZE);
  const ctx: NodeCanvasRenderingContext2D = canvas.getContext('2d');

  const location = await createLocation();
  const { meta: monsterMeta, features: monsterFeatures } =
    await createMonster();
  const { render } = createRenderer(ctx);

  if (Math.random() > 0.5) {
    location.map((l) => l.modify((i) => i.flip(true, false)));
  }

  await render(location);
  await render(monsterFeatures);

  return { canvas, meta: monsterMeta };
};

(async () => {
  const stats = new Stats();

  const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
  bar.start(amount, 0);

  for (let i = 1, buffer; i <= amount; i += 1) {
    const { canvas, meta } = await run();
    buffer = canvas.toBuffer('image/png');
    const hash = hasha(buffer, { algorithm: 'md5' });
    const image = await Jimp.read(buffer);
    const resized = image
      .resize(prodSize, prodSize, Jimp.RESIZE_NEAREST_NEIGHBOR)
      .convolute([
        [-2, -1, 0],
        [-1, 1, 1],
        [0, 1, 2]
      ]);
    buffer = await resized.getBufferAsync('image/png');

    const dir = path.resolve(outDir, String(i));
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.resolve(dir, `image.png`), buffer);

    const record = {
      ...meta,
      _c: new Date().getTime(),
      _id: unique('mon-id'),
      _tid: i,
      _h: hash,
      _author: '@daisemu'
    };

    await fs.writeFile(
      path.resolve(dir, `meta.json`),
      JSON.stringify(record, null, 2)
    );

    stats.collect(meta);
    bar.update(i);
  }

  bar.stop();
  await stats.save(path.resolve(outDir, 'stats.json'));
})();
