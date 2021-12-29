import Feature from './feature';

const isDebugMode = process.env.RENDER_DEBUG === 'true';

const createFeature = (src: string) => {
  const feature = new Feature(src, isDebugMode);
  return feature.init();
};

export { default as createRenderer } from './renderer';
export { createFeature, Feature };
