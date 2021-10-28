import { useCallback, useMemo, useRef } from 'react';
import useCanvas from '../hooks/useCanvas';
import { DrawItem } from './drawItem';
import { TextDrawItem } from './textDrawItem';

export type CanvasContainerProps = {
  drawItems: Array<DrawItem>;
  onClick?: (item: any) => void;
  onHover?: (item: any, x: number, y: number) => void;
  children?: any;
  minHeight?: number;
};

export default function CanvasContainer(props: CanvasContainerProps) {
  const { drawItems, onClick, onHover, children, minHeight } = props;

  const height = useMemo(
    () =>
      Math.min(
        20000,
        drawItems.reduce((p: number, c: DrawItem) => p + c.getHeight(), 0)
      ),
    [drawItems]
  );

  const width = useMemo(() => {
    return Math.min(
      20000,
      drawItems.reduce((p: number, c: DrawItem) => Math.max(p, c.getWidth()), 0)
    );
  }, [drawItems]);

  const draw = useCallback(
    (ctx: any) => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      drawItems?.forEach((di: any) => {
        di.draw(ctx);
      });
    },
    [drawItems]
  );

  const click = useCallback(
    ({ x, y }: { x: number; y: number }, ctx: any) => {
      const hitItem = drawItems.reduce(
        (p: any, c: DrawItem) => (!p ? c.getHit(x, y) : p),
        null
      );
      if (hitItem && onClick && hitItem.data) {
        onClick(hitItem.data);
      }
    },
    [drawItems, onClick]
  );

  const lastHit = useRef<DrawItem | null>(null);

  const hover = useCallback(
    ({ x, y }: { x: number; y: number }, ctx: any) => {
      const hitItem = drawItems.reduce(
        (p: any, c: DrawItem) => (!p ? c.getHit(x, y) : p),
        null
      );

      if (hitItem instanceof TextDrawItem) return;

      if (lastHit.current !== hitItem) {
        if (lastHit.current) {
          const di = lastHit.current as DrawItem;
          if (di) {
            di.hovering = false;
            di.parent?.draw(ctx);
            di.draw(ctx);
          }
        }
        lastHit.current = hitItem;
        if (hitItem) {
          if (onHover && hitItem.data) onHover(hitItem.data, x, y);
        }
      }
      if (hitItem) {
        hitItem.hovering = true;
        hitItem.draw(ctx);
        hitItem.parent?.draw(ctx);
      }
    },
    [drawItems, lastHit, onHover]
  );

  const canvasRef = useCanvas(draw, click, hover);

  return (
    <div
      style={{
        padding: '8px',
        position: 'relative',
        overflow: 'auto',
        minHeight,
      }}
    >
      <canvas width={width} height={height} ref={canvasRef} />
      {children}
    </div>
  );
}
