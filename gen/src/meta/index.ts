import { createName, raceMap, rarityWithChances } from './dict';
import { Meta, Rarity, Side } from './types';
import { inRange, withChance } from '../utils';

const rarityToAttrsMap = {
  ordinary: [10, 55],
  heroic: [25, 70],
  mythical: [40, 85],
  legendary: [75, 100]
};

const createMeta = (config: any): Meta => {
  const { race: raceName } = config;
  const { name: fullName, side } = raceMap[raceName as string];
  const rarity: Rarity = withChance(rarityWithChances);
  const [from, to] = rarityToAttrsMap[rarity];

  return {
    _rr: raceName,
    race: fullName,
    rarity,
    name: createName(),
    side: side as Side,
    attrs: {
      strength: inRange(from, to),
      dexterity: inRange(from, to),
      intelligence: inRange(from, to),
      luck: inRange(from, to)
    }
  };
};

export default createMeta;
