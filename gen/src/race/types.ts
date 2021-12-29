import type { TexturesSet } from '../renderer/types';
export interface Race {
  name: string;
  path: string;
  heads: TexturesSet[];
  bodies: TexturesSet[];
}
