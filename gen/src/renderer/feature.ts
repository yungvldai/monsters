import Jimp from 'jimp';
import chalk from 'chalk';
import { createImageFromBuffer, unique } from '../utils';

import type { NodeCanvasRenderingContext2D } from 'canvas';
import type { Modifier, Position, Size } from './types';

class Feature {
  private image: Jimp | null = null;
  private src: string;
  private position: Position = { x: 0, y: 0 };
  private _id: string;
  private isDebugMode: boolean;

  constructor(src: string, isDebugMode?: boolean) {
    this.src = src;
    this._id = unique('fid');
    this.isDebugMode = isDebugMode || false;
  }

  public async init() {
    return new Promise<Feature>(async (resolve, reject) => {
      try {
        this.image = await Jimp.read(this.src);
        if (this.isDebugMode) {
          console.log(chalk.blue('[inited]'), this._id, this.src);
        }

        resolve(this);
      } catch (e) {
        console.log(chalk.red('[error]'), this._id, this.src);
        reject(null);
      }
    });
  }

  public setPosition(position: Position) {
    this.position = position;
    return this;
  }

  public setImage(image: Jimp) {
    this.image = image;
    return this;
  }

  public getSrc(): string {
    return this.src;
  }

  public getPosition(): Position {
    return this.position;
  }

  public getSize(): Size {
    if (!this.image) {
      return { width: 0, height: 0 };
    }

    return {
      width: this.image.getWidth(),
      height: this.image.getHeight()
    };
  }

  public clone() {
    const feature = new Feature(this.src);
    feature.setPosition({ ...this.position });

    if (this.image) {
      feature.setImage(this.image.clone());
    }

    return feature;
  }

  public modify(callback: Modifier) {
    if (this.image) {
      this.image = callback(this.image);
    }

    return this;
  }

  public buffer() {
    if (!this.image) {
      return null;
    }

    return this.image.getBufferAsync('image/png');
  }

  public async render(ctx: NodeCanvasRenderingContext2D) {
    if (!this.image) {
      return null;
    }

    const { width, height } = this.getSize();
    const buffer = await this.buffer();
    const image = createImageFromBuffer(buffer!);

    const x = this.position.x - width / 2;
    const y = this.position.y - height / 2;

    ctx.drawImage(image, x, y);
    if (this.isDebugMode) {
      console.log(chalk.green('[rendered]'), this._id, this.src);
    }
  }
}

export default Feature;
