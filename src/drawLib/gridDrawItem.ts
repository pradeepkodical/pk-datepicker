import { StringColorOrFunc } from './../components/ColorsConfig';
import { BoxDrawItem } from "./boxDrawItem";
import { ContainerDrawItem } from "./containerDrawItem";

export class GridDrawItem extends ContainerDrawItem {
    bgColor: StringColorOrFunc = '#fff';
    color: StringColorOrFunc = '#111';
    borderColor: StringColorOrFunc = '#fff';
    selBgColor: StringColorOrFunc = '#dcf5ff';
    text?: string;
    draw(ctx: any) {
        ctx.fillStyle = this.selected || this.hovering ? this.selBgColor : this.bgColor;
        ctx.fillRect(this.left, this.top, this.getWidth(), this.getHeight());
        if (this.borderColor !== this.bgColor) {
            ctx.strokeWidth = 0.5;
            ctx.strokeStyle = this.borderColor;
            ctx.strokeRect(this.left, this.top, this.getWidth(), this.getHeight());
        }

        super.draw(ctx);

        if (this.text) {
            ctx.font = "9px Verdana";
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';
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
        color: StringColorOrFunc,
        bgColor: StringColorOrFunc,
        selBgColor: StringColorOrFunc,
        borderColor: StringColorOrFunc,
        data: any,
        text?: string
    ) {
        const item = new GridDrawItem();
        item.left = left;
        item.top = top;
        item.width = size;
        item.height = size;
        item.bgColor = bgColor;
        item.selBgColor = selBgColor;
        item.data = data;
        item.text = text;
        item.color = color;
        item.borderColor = borderColor;

        const arr1 = data;
        const c = Math.min(arr1.length, 2);
        const size1 = size / c - 1;

        arr1.forEach((a: any, idx: number) => {
            const item1 = BoxDrawItem.create(
                left + (idx % c) * size1,
                top + Math.floor(idx / c) * size1,
                size1,
                color,
                a.bgColor,
                selBgColor,
                borderColor,
                a,
                ``
            );
            item1.parent = item;
            item.items.push(item1);
        });
        return item;
    }
}