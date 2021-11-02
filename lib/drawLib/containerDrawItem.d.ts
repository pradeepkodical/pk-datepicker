import { BoxDrawItem } from "./boxDrawItem";
import { DrawItem, IDrawItem } from "./drawItem";
export declare class ContainerDrawItem extends BoxDrawItem {
    items: Array<DrawItem>;
    lines: Array<IDrawItem>;
    draw(ctx: any): void;
    getWidth(): number;
    getHeight(): number;
    getHit(x: number, y: number): DrawItem | null;
}
