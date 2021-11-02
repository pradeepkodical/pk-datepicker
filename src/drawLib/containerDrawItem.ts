import { BoxDrawItem } from "./boxDrawItem";
import { DrawItem, IDrawItem } from "./drawItem";

export class ContainerDrawItem extends BoxDrawItem {
    items: Array<DrawItem> = [];
    lines: Array<IDrawItem> = [];

    draw(ctx: any) {
        ctx.fillStyle = this.bgColor;
        ctx.fillRect(this.left, this.top, this.getWidth(), this.getHeight());

        this.lines.forEach((x: IDrawItem) => x.draw(ctx));
        this.items.forEach((x: DrawItem) => x.draw(ctx));
    }

    getWidth() {
        return this.width !== 0 ? this.width : this.items.reduce((p: number, c: DrawItem) => Math.max(p, c.left + c.getWidth()), 0) - this.left;
    }

    getHeight() {
        let h = this.height;
        h = h !== 0 ? h : this.items.reduce((p: number, c: DrawItem) => Math.max(p, c.top + c.getHeight()), 0) - this.top;
        return Math.max(h, this.minHeight);
    }

    getHit(x: number, y: number): DrawItem | null {
        const hit = super.getHit(x, y);
        if (hit) {
            for (let i = 0; i < this.items.length; i++) {
                const item = this.items[i].getHit(x, y);
                if (item) {
                    return item;
                }
            }
        }
        return hit;
    }
}