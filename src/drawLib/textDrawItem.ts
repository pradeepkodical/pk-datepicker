import { DrawItem, StringOrFunc } from "./drawItem";

export class TextDrawItem extends DrawItem {

    text: string = '';
    color: StringOrFunc = '#111';
    bgColor: StringOrFunc = '#fff';
    draw(ctx: any) {

        ctx.font = '12px Verdana';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        const size = ctx.measureText(this.text);
        ctx.fillStyle = this.getColor(ctx, this.bgColor);
        ctx.fillRect(this.left, this.top, size.width, this.height);
        ctx.fillStyle = this.getColor(ctx, this.color);

        //ctx.strokeStyle = this.color;
        //ctx.strokeRect(this.left, this.top, size.width, this.height);

        ctx.fillText(this.text, this.left, this.top + this.height / 2);
    }

    static create(
        left: number,
        top: number,
        height: number,
        color: StringOrFunc,
        bgColor: StringOrFunc,
        text: string,
        data: any
    ) {
        const item = new TextDrawItem();
        item.left = left;
        item.top = top;
        item.width = 0;
        item.height = height;
        item.color = color;
        item.bgColor = bgColor;
        item.text = text;
        item.data = data;
        return item;
    }
}