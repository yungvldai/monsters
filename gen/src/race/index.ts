import path from 'path';
import { getFolderContents } from '../utils';
import type { Race } from './types';

const racesPath = 'assets/races';
const headPath = 'head';
const bodyPath = 'body';

const loadParts = async (partsPath: string, id: string) => {
  const parts = await getFolderContents(partsPath);
  const rest = parts.filter((part) => !/base/.test(part));
  const [baseFilename] = parts.filter((part) => /base/.test(part));

  return {
    id,
    base: path.resolve(partsPath, baseFilename),
    rest: rest.map((file) => path.resolve(partsPath, file))
  };
};

const loadRace = async (race: string): Promise<Race | null> => {
  const racePath = path.resolve(racesPath, race);

  const headsPromises = getFolderContents(
    path.resolve(racePath, headPath)
  ).then((heads) => {
    return Promise.all(
      heads.map((head) =>
        loadParts(path.resolve(racePath, headPath, head), head)
      )
    );
  });

  const bodiesPromises = getFolderContents(
    path.resolve(racePath, bodyPath)
  ).then((bodies) => {
    return Promise.all(
      bodies.map((body) =>
        loadParts(path.resolve(racePath, bodyPath, body), body)
      )
    );
  });

  const [heads, bodies] = await Promise.all([headsPromises, bodiesPromises]);

  if (heads.length === 0 || bodies.length === 0) {
    return null;
  }

  return {
    name: race,
    path: racePath,
    heads,
    bodies
  };
};

export const getRacesInfo = async (): Promise<Race[]> => {
  const racesNames = await getFolderContents(racesPath);
  const races = await Promise.all(racesNames.map(loadRace));

  return races.filter(Boolean) as Race[];
};

export const getRaces = () => {
  return getFolderContents(racesPath);
};
