export interface IDrawItem {
    draw(ctx: any): void;
    moveBy(x1: number, y1: number): IDrawItem;
}

export type StringOrFunc = string | (() => Array<string>);

export abstract class DrawItem implements IDrawItem {
    top: number = 0;
    left: number = 0;
    width: number = 0;
    height: number = 0;
    minHeight: number = 0;
    data: any = null;
    hovering: boolean = false;
    selected: boolean = false;
    parent?: DrawItem;
    abstract draw(ctx: any): void;
    getWidth() {
        return this.width;
    }
    getHeight() {
        return Math.max(this.height, this.minHeight);
    }
    getHit(x: number, y: number): DrawItem | null {
        return (this.left <= x && this.left + this.getWidth() >= x && this.top <= y && this.top + this.getHeight() >= y) ? this : null;
    }
    moveBy(x: number, y: number) {
        this.left += x;
        this.top += y;
        return this;
    }
    setHeight(h: number) {
        this.height = h;
        return this;
    }

    getColor(ctx: any, color: string | (() => Array<string>)) {
        if (typeof color === "function") {
            const colors = color();
            const grd = ctx.createLinearGradient(
                this.left,
                this.top,
                this.left + this.getWidth(),
                this.top + this.getHeight()
            );
            grd.addColorStop(0, colors[0]);
            grd.addColorStop(1, colors[1]);
            return grd;
        }
        return color;
    }
}