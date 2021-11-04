import { DrawItem, StringOrFunc } from "./drawItem";
export declare class TextDrawItem extends DrawItem {
    text: string;
    color: StringOrFunc;
    bgColor: StringOrFunc;
    draw(ctx: any): void;
    static create(left: number, top: number, height: number, color: StringOrFunc, bgColor: StringOrFunc, text: string, data: any): TextDrawItem;
}
