import { promises as fs } from 'fs';
import { Meta } from '../meta/types';

class Stats {
  private stats: any;

  constructor() {
    this.stats = {
      rarity: {},
      race: {},
      side: {}
    };
  }

  collect(meta: Meta) {
    const { race, rarity, side } = meta;

    if (!this.stats.race[race]) {
      this.stats.race[race] = 0;
    }

    this.stats.race[race] += 1;

    if (!this.stats.rarity[rarity]) {
      this.stats.rarity[rarity] = 0;
    }

    this.stats.rarity[rarity] += 1;

    if (!this.stats.side[side]) {
      this.stats.side[side] = 0;
    }

    this.stats.side[side] += 1;
  }

  save(out: string) {
    return fs.writeFile(out, JSON.stringify(this.stats, null, 2));
  }
}

export default Stats;
