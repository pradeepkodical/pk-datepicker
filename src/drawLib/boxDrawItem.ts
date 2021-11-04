import { DrawItem, StringOrFunc } from "./drawItem";

export class BoxDrawItem extends DrawItem {
    bgColor: StringOrFunc = '#fff';
    color: StringOrFunc = '#111';
    borderColor: StringOrFunc = '#fff';
    selBgColor: StringOrFunc = '#dcf5ff';
    text?: string;
    textAlign?: string = 'center';
    sideKick?: DrawItem;
    font?: string = '9px Verdana';
    draw(ctx: any) {

        ctx.fillStyle = this.getSelectedBg(ctx, this.bgColor, this.selBgColor);
        ctx.fillRect(this.left, this.top, this.getWidth(), this.getHeight());

        //console.log(`box ${this.text} ${this.hovering} ${ctx.fillStyle} ${this.left} ${this.top} ${this.getWidth()} ${this.getHeight()}`);

        if (this.borderColor !== this.bgColor) {
            ctx.strokeWidth = 0.5;
            ctx.strokeStyle = this.getColor(ctx, this.borderColor);
            ctx.strokeRect(this.left, this.top, this.getWidth(), this.getHeight());
        }
        if (this.text) {
            ctx.font = this.font;
            ctx.textBaseline = 'middle';
            let x = this.left + 5;
            let y = this.top + this.getHeight() / 2;
            if (this.textAlign === 'center') {
                x = this.left + this.getWidth() / 2;
            }
            else if (this.textAlign === 'right') {
                x = this.left + this.getWidth() - 5;
            }
            ctx.textAlign = this.textAlign;
            ctx.fillStyle = this.getColor(ctx, this.color);
            ctx.fillText(
                this.text,
                x,
                y,
                this.getWidth()
            );
        }
        if (this.sideKick) this.sideKick.draw(ctx);
    }

    setTextAlign(textAlign: "left" | "right" | "center") {
        this.textAlign = textAlign;
        return this;
    }

    setFont(font: string) {
        this.font = font;
        return this;
    }

    static create(
        left: number,
        top: number,
        size: number,
        color: StringOrFunc,
        bgColor: StringOrFunc,
        selBgColor: StringOrFunc,
        borderColor: StringOrFunc,
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