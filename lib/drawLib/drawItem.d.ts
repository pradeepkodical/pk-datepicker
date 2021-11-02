export interface IDrawItem {
    draw(ctx: any): void;
    moveBy(x1: number, y1: number): IDrawItem;
}
export declare type StringOrFunc = string | (() => Array<string>);
export declare abstract class DrawItem implements IDrawItem {
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
    moveBy(x: number, y: number): this;
    setHeight(h: number): this;
    getColor(ctx: any, color: string | (() => Array<string>)): any;
}
