import { useCallback, useMemo, useRef } from 'react';
import useCanvas from '../hooks/useCanvas';
import { ContainerDrawItem } from './containerDrawItem';
import { DrawItem } from './drawItem';
import { TextDrawItem } from './textDrawItem';

export type CanvasContainerProps = {
  drawItems: Array<DrawItem>;
  onClick?: (item: any) => void;
  onHover?: (item: any) => void;
  children?: any;
  minHeight?: number;
};

export default function CanvasContainer(props: CanvasContainerProps) {
  const { drawItems, onClick, onHover, minHeight } = props;

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

      const resetLastItem = () => {
        if (lastHit.current) {
          const di = lastHit.current as DrawItem;
          if (di) {
            di.hovering = false;
            di.parent?.draw(ctx);
            di.draw(ctx);
          }
          lastHit.current = null;
        }
      };

      if (
        hitItem instanceof TextDrawItem ||
        hitItem instanceof ContainerDrawItem
      ) {
        if (lastHit.current) {
          resetLastItem();
          if (onHover) onHover(null);
        }
        return;
      }

      if (lastHit.current !== hitItem) {
        resetLastItem();
        if (hitItem) {
          if (onHover) onHover(hitItem.data);
        }
      }

      if (hitItem) {
        hitItem.hovering = true;
        hitItem.parent?.draw(ctx);
        hitItem.draw(ctx);
      }
      lastHit.current = hitItem;
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
        width: '100%',
        minHeight,
      }}
    >
      <canvas width={width} height={height} ref={canvasRef} />
    </div>
  );
}
