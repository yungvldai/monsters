import Jimp from 'jimp/*';

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export type Modifier = (image: Jimp) => Jimp;

export interface TexturesSet {
  id?: string;
  base: string;
  rest: string[];
}
