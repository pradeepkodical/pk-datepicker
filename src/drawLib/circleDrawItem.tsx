import { DrawItem } from './drawItem';

export class CircleDrawItem extends DrawItem {
  bgColor: string = '#fff';
  borderColor: string = '#fff';
  selBgColor: string = '#dcf5ff';
  text: string = '';
  draw(ctx: any) {
    ctx.fillStyle =
      this.selected || this.hovering ? this.selBgColor : this.bgColor;
    ctx.strokeStyle = this.borderColor;
    ctx.beginPath();
    ctx.arc(
      this.left + this.getWidth() / 2,
      this.top + this.getWidth() / 2,
      this.getWidth() / 2,
      0,
      2 * Math.PI
    );
    ctx.stroke();
    ctx.fill();

    if (this.text) {
      ctx.font = '9px Verdana';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#000';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        this.text,
        this.left + this.getWidth() / 2,
        this.top + this.getHeight() / 2,
        this.getWidth()
      );
    }
  }

  static create(
    left: number,
    top: number,
    size: number,
    bgColor: string,
    data: any,
    text: string
  ) {
    const item = new CircleDrawItem();
    item.left = left;
    item.top = top;
    item.width = size;
    item.height = size;
    item.bgColor = bgColor;
    item.data = data;
    item.text = text;
    return item;
  }
}
