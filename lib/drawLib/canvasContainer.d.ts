/// <reference types="react" />
import { DrawItem } from './drawItem';
export declare type CanvasContainerProps = {
    drawItems: Array<DrawItem>;
    onClick?: (item: any) => void;
    onHover?: (item: any, x: number, y: number) => void;
    children?: any;
    minHeight?: number;
};
export default function CanvasContainer(props: CanvasContainerProps): JSX.Element;
