import { DrawItem, StringOrFunc } from "./drawItem";
export declare class BoxDrawItem extends DrawItem {
    bgColor: StringOrFunc;
    color: StringOrFunc;
    borderColor: StringOrFunc;
    selBgColor: StringOrFunc;
    text?: string;
    textAlign?: string;
    sideKick?: DrawItem;
    draw(ctx: any): void;
    setTextAlign(textAlign: "left" | "right" | "center"): this;
    static create(left: number, top: number, size: number, color: StringOrFunc, bgColor: StringOrFunc, selBgColor: StringOrFunc, borderColor: StringOrFunc, data: any, text?: string): BoxDrawItem;
}
