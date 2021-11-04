import { StringColorOrFunc } from './../components/ColorsConfig';
import { ContainerDrawItem } from "./containerDrawItem";
export declare class GridDrawItem extends ContainerDrawItem {
    bgColor: StringColorOrFunc;
    color: StringColorOrFunc;
    borderColor: StringColorOrFunc;
    selBgColor: StringColorOrFunc;
    text?: string;
    draw(ctx: any): void;
    static create(top: number, left: number, size: number, color: StringColorOrFunc, bgColor: StringColorOrFunc, selBgColor: StringColorOrFunc, borderColor: StringColorOrFunc, data: any, text?: string): GridDrawItem;
}
