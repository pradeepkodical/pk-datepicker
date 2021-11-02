import { IDrawItem } from './drawItem';

export class LineDrawItem implements IDrawItem {
  color: string = '#fff';
  x1: number = 0;
  y1: number = 0;
  x2: number = 0;
  y2: number = 0;
  data: any;

  draw(ctx: any) {
    ctx.beginPath();
    ctx.moveTo(this.x1, this.y1);
    ctx.lineTo(this.x2, this.y2);
    ctx.strokeStyle = this.color;
    ctx.stroke();
  }

  moveBy(x: number, y: number) {
    this.x1 += x;
    this.y1 += y;

    this.x2 += x;
    this.y2 += y;
    return this;
  }

  static create(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color: string,
    data: any
  ) {
    const item = new LineDrawItem();
    item.x1 = x1;
    item.y1 = y1;
    item.x2 = x2;
    item.y2 = y2;
    item.color = color;
    item.data = data;
    return item;
  }
}
