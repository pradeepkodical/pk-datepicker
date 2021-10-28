import { DrawItem } from "./drawItem";
export declare class BoxDrawItem extends DrawItem {
    bgColor: string;
    color: string;
    borderColor: string;
    selBgColor: string;
    text?: string;
    draw(ctx: any): void;
    static create(top: number, left: number, size: number, color: string, bgColor: string, selBgColor: string, borderColor: string, data: any, text?: string): BoxDrawItem;
}
