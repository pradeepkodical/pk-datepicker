export declare abstract class DrawItem {
    top: number;
    left: number;
    width: number;
    height: number;
    minHeight: number;
    data: any;
    hovering: boolean;
    selected: boolean;
    parent?: DrawItem;
    abstract draw(ctx: any): void;
    getWidth(): number;
    getHeight(): number;
    getHit(x: number, y: number): DrawItem | null;
}
