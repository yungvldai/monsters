import { NodeCanvasRenderingContext2D } from 'canvas';
import hasha from 'hasha';
import Feature from './feature';

const createRenderer = (ctx: NodeCanvasRenderingContext2D) => {
  const srcs: string[] = [];

  const render = async (features: Feature[]) => {
    for await (const feature of features) {
      srcs.push(feature.getSrc());
      feature.render(ctx);
    }

    return ctx;
  };

  const hash = () => {
    return hasha(srcs.sort().join(','), { algorithm: 'md5' });
  };

  return { render, hash };
};

export default createRenderer;
