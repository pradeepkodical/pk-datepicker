import { BoxDrawItem } from "./boxDrawItem";
import { DrawItem } from "./drawItem";
export declare class ContainerDrawItem extends BoxDrawItem {
    items: Array<DrawItem>;
    draw(ctx: any): void;
    getWidth(): number;
    getHeight(): number;
    getHit(x: number, y: number): DrawItem | null;
}
