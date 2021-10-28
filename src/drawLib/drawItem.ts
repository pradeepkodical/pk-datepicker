export abstract class DrawItem {
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
}