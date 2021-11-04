import { DefaultColorOrFunc } from '../components/ColorsConfig';
export interface IDrawItem {
    draw(ctx: any): void;
    moveBy(x1: number, y1: number): IDrawItem;
}
export declare type StringOrFunc = DefaultColorOrFunc;
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
    getSelectedBg(ctx: any, defaultColor: StringOrFunc, selColor: StringOrFunc): any;
    getColor(ctx: any, color: StringOrFunc): any;
}
