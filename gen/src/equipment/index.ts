import path from 'path';
import { getFolderContents } from '../utils';
import { getRacesInfo } from '../race';
import { TexturesSet } from '../renderer/types';

const equipmentPath = 'assets/equipment';
const commonPath = 'common';
const overridesPath = 'overrides';
const overrideAll = 'all';
const overrideRuleDelimeter = '@';

const ORD = overrideRuleDelimeter;

const loadItemPartsFromFolder = async (itemPath: string) => {
  const parts = await getFolderContents(itemPath);
  const [base] = parts.filter((part) => /base/.test(part));
  const rest = parts.filter((part) => !/base/.test(part));

  return {
    id: '', // not needed
    base: path.resolve(itemPath, base),
    rest: rest.map((file) => path.resolve(itemPath, file))
  };
};

const loadVariant = async (variantPath: string, equipmentType: string) => {
  const races = await getRacesInfo();
  const raceIndexed = races.reduce((acc, race) => {
    const { name: raceName } = race;

    if (/!byhead/.test(equipmentType)) {
      const { heads } = races.find(({ name }) => name === raceName)!;
      return [
        ...acc,
        ...heads.map(({ id }: TexturesSet) => [raceName, id].join(ORD))
      ];
    }

    const { bodies } = races.find(({ name }) => name === raceName)!;
    return [
      ...acc,
      ...bodies.map(({ id }: TexturesSet) => [raceName, id].join(ORD))
    ];
  }, [] as string[]);

  const common = await loadItemPartsFromFolder(
    path.resolve(variantPath, commonPath)
  );

  const variant = raceIndexed.reduce((acc, key) => {
    return {
      ...acc,
      [key]: common
    };
  }, {} as Record<string, any>);

  const overridesList = await getFolderContents(
    path.resolve(variantPath, overridesPath)
  );
  const overrides = await Promise.all(
    overridesList
      .map((override) => path.resolve(variantPath, overridesPath, override))
      .map(loadItemPartsFromFolder)
  );

  for (let i = 0; i < overridesList.length; i += 1) {
    const key = overridesList[i];
    const [overrideRace, overrideVariant] = key.split(ORD);

    if (overrideVariant === overrideAll) {
      raceIndexed
        .filter((raceIndex) => {
          const [raceName] = raceIndex.split(ORD);
          return overrideRace === raceName;
        })
        .forEach((x) => {
          variant[x] = overrides[i];
        });

      continue;
    }

    variant[key] = overrides[i];
  }

  return variant;
};

const getEquipmentVariants = async (equipmentType: string) => {
  const equipmentVariantsPath = path.resolve(equipmentPath, equipmentType);

  return getFolderContents(equipmentVariantsPath).then((variants) => {
    return Promise.all(
      variants.map((variant) =>
        loadVariant(path.resolve(equipmentVariantsPath, variant), equipmentType)
      )
    );
  });
};

const getEquipment = async () => {
  const equipmentTypes = await getFolderContents(equipmentPath);
  const equipment: Record<string, any> = {};

  for (const equipmentType of equipmentTypes) {
    equipment[equipmentType] = [
      ...(await getEquipmentVariants(equipmentType)),
      null
    ];
  }

  return equipment;
};

export default getEquipment;
