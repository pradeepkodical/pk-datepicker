import { ContainerDrawItem } from "./containerDrawItem";
export declare class GridDrawItem extends ContainerDrawItem {
    bgColor: string;
    color: string;
    borderColor: string;
    selBgColor: string;
    text?: string;
    draw(ctx: any): void;
    static create(top: number, left: number, size: number, color: string, bgColor: string, selBgColor: string, borderColor: string, data: any, text?: string): GridDrawItem;
}
