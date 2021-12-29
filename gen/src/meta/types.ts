export type Rarity = 'ordinary' | 'heroic' | 'mythical' | 'legendary';
export type Side = 'light' | 'neutral' | 'darkness';

export interface Attributes {
  strength: number;
  dexterity: number;
  intelligence: number;
  luck: number;
}

export interface Meta {
  race: string;
  name: string;
  rarity: Rarity;
  attrs: Attributes;
  side: Side;
  _rr: string;
}
