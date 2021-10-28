import { DrawItem } from "./drawItem";
export declare class TextDrawItem extends DrawItem {
    text: string;
    color: string;
    bgColor: string;
    draw(ctx: any): void;
    static create(left: number, top: number, height: number, color: string, bgColor: string, text: string, data: any): TextDrawItem;
}
