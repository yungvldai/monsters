import { getRacesInfo } from '../race';
import { getRandom } from '../utils';
import { createFeature, Feature } from '../renderer';
import { CENTER } from '../scene';

import type { TexturesSet } from '../renderer/types';
import getEquipment from '../equipment';
import createMeta from '../meta';

import { Monster } from './types';

type Layer = 'back' | 'front' | 'middle';

interface FeatureAndLayer {
  feature: Feature;
  layer: Layer;
}

const modifiers = ['hue', 'tint', 'shade'];

const createModifierRegExp = (m: string) =>
  new RegExp(`!${m}\\(([a-z0-9]+)\\)`);

const getLayerByName = (name: string): Layer => {
  if (/!back/.test(name)) {
    return 'back';
  }

  if (/!front/.test(name)) {
    return 'front';
  }

  return 'middle';
};

const getModifiersApplyKeysMap = (features: Feature[]) => {
  return features.reduce((acc, feature) => {
    const featurePath = feature.getSrc();

    const [hue, tint, shade] = modifiers
      .map(createModifierRegExp)
      .map((r) => r.exec(featurePath));

    if (hue) {
      const [, key] = hue;

      return {
        ...acc,
        [`hue$${key}`]: Math.floor(Math.random() * 360)
      };
    }

    if (tint) {
      const [, key] = tint;

      return {
        ...acc,
        [`tint$${key}`]: Math.floor(Math.random() * 100)
      };
    }

    if (shade) {
      const [, key] = shade;

      return {
        ...acc,
        [`shade$${key}`]: Math.floor(Math.random() * 100)
      };
    }

    return acc;
  }, {} as Record<string, number>);
};

const applyModifiers = (
  features: Feature[],
  applyKeys: Record<string, number>
) => {
  for (const feature of features) {
    const featurePath = feature.getSrc();

    const [hue, tint, shade] = modifiers
      .map(createModifierRegExp)
      .map((r) => r.exec(featurePath));

    if (hue) {
      const [, key] = hue;
      const value = applyKeys[`hue$${key}`];

      feature.modify((i) => i.color([{ apply: 'hue', params: [value] }]));
    }

    if (tint) {
      const [, key] = tint;
      const value = applyKeys[`tint$${key}`];

      feature.modify((i) => i.color([{ apply: 'tint', params: [value] }]));
    }

    if (shade) {
      const [, key] = shade;
      const value = applyKeys[`shade$${key}`];

      feature.modify((i) => i.color([{ apply: 'shade', params: [value] }]));
    }
  }

  return features;
};

const createPart = async ({ base, rest }: TexturesSet): Promise<Feature[]> => {
  const baseFeature = await createFeature(base);
  baseFeature.setPosition(CENTER);

  const restFeatures = await Promise.all(rest.map((src) => createFeature(src)));

  return [
    baseFeature,
    ...restFeatures
      .map((feature) => {
        feature.setPosition(CENTER);
        const featurePath = feature.getSrc();

        if (/!opt/.test(featurePath)) {
          return Math.random() > 0.5 ? feature : null!;
        }

        return feature;
      })
      .filter(Boolean)
  ];
};

const createLayeredPart = async ({
  base,
  rest
}: TexturesSet): Promise<FeatureAndLayer[]> => {
  const baseFeature = await createFeature(base);
  baseFeature.setPosition(CENTER);

  const restFeatures = await Promise.all(rest.map((src) => createFeature(src)));

  return [
    {
      feature: baseFeature,
      layer: getLayerByName(base)
    },
    ...restFeatures
      .map((feature) => {
        feature.setPosition(CENTER);
        const featurePath = feature.getSrc();
        const layeredFeature = {
          feature,
          layer: getLayerByName(feature.getSrc())
        };

        if (/!opt/.test(featurePath)) {
          return Math.random() > 0.5 ? layeredFeature : null!;
        }

        return layeredFeature;
      })
      .filter(Boolean)
  ];
};

const suitUp = async (
  race: string,
  headId: string,
  bodyId: string,
  skip?: boolean
) => {
  const frontLayer: Feature[] = [];
  const backLayer: Feature[] = [];
  const middleLayer: Feature[] = [];

  if (skip) {
    return { frontLayer, middleLayer, backLayer };
  }

  const equipment = await getEquipment();

  for (const equipmentType of Object.keys(equipment)) {
    const equipmentVariants = equipment[equipmentType];
    const randomEquipment = getRandom(equipmentVariants) as Record<
      string,
      TexturesSet
    >;

    if (!randomEquipment) {
      continue;
    }

    const textureSet =
      randomEquipment[
        `${race}@${/!byhead/.test(equipmentType) ? headId : bodyId}`
      ];
    const featuresAndLayers = await createLayeredPart(textureSet);

    for (const { layer, feature } of featuresAndLayers) {
      if (layer === 'front') {
        frontLayer.push(feature);
        continue;
      }

      if (layer === 'back') {
        backLayer.push(feature);
        continue;
      }

      middleLayer.push(feature);
    }
  }

  return { frontLayer, middleLayer, backLayer };
};

const createMonster = async (): Promise<Monster> => {
  const races = await getRacesInfo();
  const race = getRandom(races);
  const { heads, bodies, name: raceName, path: racePath } = race;

  const head = getRandom(heads);
  const { id: headId } = head;
  const headRenderQueue: Feature[] = await createPart(head);

  const body = getRandom(bodies);
  const { id: bodyId } = body;
  const bodyRenderQueue: Feature[] = await createPart(body);

  const skipEquipment = /!noeq/.test(racePath);

  const {
    frontLayer: frontEquipment,
    middleLayer: middleEquipment,
    backLayer: backEquipment
  } = await suitUp(raceName, headId!, bodyId!, skipEquipment);

  const features = [
    ...backEquipment,
    ...bodyRenderQueue,
    ...middleEquipment,
    ...headRenderQueue,
    ...frontEquipment
  ];

  const metaConfig = {
    race: raceName
  };

  const applyKeys = getModifiersApplyKeysMap(features);
  return {
    features: applyModifiers(features, applyKeys),
    meta: createMeta(metaConfig)
  };
};

export default createMonster;
