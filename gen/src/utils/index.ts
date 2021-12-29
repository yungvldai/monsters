import fs from 'fs';
import { Image } from 'canvas';

export const getFolderContents = (folder: string): Promise<string[]> => {
  return new Promise((resolve) => {
    fs.readdir(folder, (error, files) => {
      if (error) {
        resolve([]);
        return;
      }

      resolve(files.sort());
    });
  });
};

export const getRandom = <T>(array: T[]): T => {
  const { length } = array;
  return array[Math.floor(Math.random() * length)];
};

export const createImageFromBuffer = (buffer: Buffer) => {
  const image = new Image();
  image.src = buffer;
  return image;
};

export const unique = (code: string): string => {
  return `x-${code}-xxxxx-xx`.replace(/[x]/g, () => {
    return ((Math.random() * 16) | 0).toString(16);
  });
};

export const shiftBaseLeft = (a: string, b: string) => {
  if (/base/.test(a)) {
    return -1;
  }

  if (/base/.test(b)) {
    return 1;
  }

  return 0;
};

export const shuffleArray = <T>(array: T[]) => {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex]
    ];
  }
  return array;
};

export const inRange = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const withChance = <T>(array: { value: T; chance: number }[]): T => {
  const random = Math.random();
  for (let i = 0; i < array.length; i += 1) {
    let to = 0;
    for (let j = 0; j <= i; j += 1) {
      to += array[j].chance;
    }
    let from = to - array[i].chance;
    if (random < to && random >= from) {
      return array[i].value;
    }
  }
  return array[0].value;
};
