import { DrawItem, StringOrFunc } from "./drawItem";

export class BoxDrawItem extends DrawItem {
    bgColor: StringOrFunc = '#fff';
    color: string = '#111';
    borderColor: string = '#fff';
    selBgColor: StringOrFunc = '#dcf5ff';
    text?: string;
    sideKick?: DrawItem;
    draw(ctx: any) {
        const bg = this.getColor(ctx, this.bgColor);
        const selBg = this.getColor(ctx, this.selBgColor);
        ctx.fillStyle = this.selected || this.hovering ? selBg : bg;
        ctx.fillRect(this.left, this.top, this.getWidth(), this.getHeight());

        //console.log(`box ${this.text} ${this.hovering} ${ctx.fillStyle} ${this.left} ${this.top} ${this.getWidth()} ${this.getHeight()}`);

        if (this.borderColor !== this.bgColor) {
            ctx.strokeWidth = 0.5;
            ctx.strokeStyle = this.borderColor;
            ctx.strokeRect(this.left, this.top, this.getWidth(), this.getHeight());
        }
        if (this.text) {
            ctx.font = "9px Verdana";
            ctx.textBaseline = 'middle';
            ctx.textAlign = "center";
            ctx.fillStyle = this.color;
            ctx.fillText(
                this.text,
                this.left + this.getWidth() / 2,
                this.top + this.getHeight() / 2,
                this.getWidth()
            );
        }
        if (this.sideKick) this.sideKick.draw(ctx);
    }

    static create(
        left: number,
        top: number,
        size: number,
        color: string,
        bgColor: StringOrFunc,
        selBgColor: StringOrFunc,
        borderColor: string,
        data: any,
        text?: string
    ) {
        const item = new BoxDrawItem();
        item.left = left;
        item.top = top;
        item.width = size;
        item.height = size;
        item.color = color;
        item.bgColor = bgColor;
        item.selBgColor = selBgColor;
        item.borderColor = borderColor;
        item.data = data;
        item.text = text;
        return item;
    }
}