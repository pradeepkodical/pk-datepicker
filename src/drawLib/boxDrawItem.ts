import { DrawItem } from "./drawItem";

export class BoxDrawItem extends DrawItem {
    bgColor: string = '#fff';
    color: string = '#111';
    borderColor: string = '#fff';
    selBgColor: string = '#dcf5ff';
    text?: string;
    draw(ctx: any) {
        ctx.fillStyle = this.selected || this.hovering ? this.selBgColor : this.bgColor;
        ctx.fillRect(this.left, this.top, this.getWidth(), this.getHeight());
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
    }

    static create(
        top: number,
        left: number,
        size: number,
        color: string,
        bgColor: string,
        selBgColor: string,
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