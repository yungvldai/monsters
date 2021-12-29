import { getRandom } from '../utils';
import { Rarity } from './types';

/* cSpell:disable */

const list = [
  'Ada',
  'Aldesc',
  'Alhalius',
  'Amanchi',
  'Ashmi',
  'Ashtazi',
  'Baal',
  "Bas'gran",
  'Bau',
  'Be',
  'Bogrorn',
  'Brasoo',
  'Buckbrasca',
  'Caa',
  'Came',
  'Chaelba',
  'Chochm',
  'Clageor',
  'Cudruk',
  'Danneus',
  'Das',
  'Dorin',
  'Drargdra',
  'Droulfan',
  'Edjohn',
  'Edsanthony',
  'Fan',
  'Fledo',
  'Furca',
  'Gacu',
  'Ganorre',
  'Gnawcome',
  'Golsytlotl',
  "Gorma'lee",
  'Gun-thrak',
  'Habeorth',
  'Hadurta',
  'Haskrummhal',
  'Hauruul',
  'Heber',
  'Hlyissjibover',
  'Imiths',
  'Jaedra',
  'Jahra',
  'Kaja',
  'Kasalca',
  'Khorthly',
  "Kil'gan",
  'Lantbugma',
  'Lialre',
  'Lisist',
  'Lithtlal',
  'Madreal',
  "Mancu'ad",
  'Manshu',
  'Mar',
  'Margflas',
  'Mes',
  'Mondken',
  "Na'ma",
  'Naglcuīxnesh',
  'Nathal',
  'Neabel',
  'Nenlel',
  'Nesorth',
  'Nethga',
  'Niel-tho',
  'Norrushang',
  'Parruk',
  'Phiagrim',
  'Polte',
  'Psahud',
  'Ra',
  'Raimraii',
  'Rammo',
  'Raumgrorn',
  'Rikdela',
  'Rocghago',
  'Ronzorg-lo',
  'Sasthte',
  'Saukha',
  'Shacyt',
  "Si'be",
  'Sthmysswi',
  'Sufra',
  'Tagard',
  'Thaemann',
  'Theodta',
  'Thon',
  'Thrythdoom',
  "Tol'ris",
  'Traborg',
  'Triva',
  'Uanne',
  'Ulfkeel',
  'Wa',
  'Wilsa',
  'Yesdrag',
  'Ygash',
  'Zalscoxna'
];

/* cSpell:enable */

export const createName = () => {
  const firstName = getRandom(list);
  const lastName = getRandom(list);

  return `${firstName} ${lastName}`;
};

interface RaceObj {
  name: string;
  side: string;
}

export const raceMap: Record<string, RaceObj> = {
  taurun: {
    name: 'Taurun',
    side: 'light'
  },
  human: {
    name: 'Human',
    side: 'light'
  },
  ogre: {
    name: 'Ogre',
    side: 'light'
  },
  piglon: {
    name: 'Piglon',
    side: 'neutral'
  },
  skeleton: {
    name: 'Skeleton',
    side: 'darkness'
  },
  wutig: {
    name: 'Wu-Tig',
    side: 'neutral'
  },
  troll: {
    name: 'Troll',
    side: 'light'
  },
  darksentiel: {
    name: 'Dark Sentinel',
    side: 'darkness'
  },
  vampire: {
    name: 'Vampire',
    side: 'darkness'
  },
  woolf: {
    name: 'Woolf',
    side: 'neutral'
  },
  undead: {
    name: 'Undead',
    side: 'darkness'
  }
};

export const rarityWithChances: { value: Rarity; chance: number }[] = [
  {
    value: 'ordinary',
    chance: 0.5
  },
  {
    value: 'heroic',
    chance: 0.3
  },
  {
    value: 'mythical',
    chance: 0.14
  },
  {
    value: 'legendary',
    chance: 0.06
  }
];
