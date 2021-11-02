import { DrawItem, StringOrFunc } from "./drawItem";
export declare class BoxDrawItem extends DrawItem {
    bgColor: StringOrFunc;
    color: string;
    borderColor: string;
    selBgColor: StringOrFunc;
    text?: string;
    sideKick?: DrawItem;
    draw(ctx: any): void;
    static create(left: number, top: number, size: number, color: string, bgColor: StringOrFunc, selBgColor: StringOrFunc, borderColor: string, data: any, text?: string): BoxDrawItem;
}
