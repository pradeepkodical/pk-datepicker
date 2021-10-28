import { useEffect, useRef } from 'react';

function getMousePos(ctx: any, evt: any) {
  var rect = ctx.canvas.getBoundingClientRect();
  return {
    x:
      ((evt.clientX - rect.left) / (rect.right - rect.left)) * ctx.canvas.width,
    y:
      ((evt.clientY - rect.top) / (rect.bottom - rect.top)) * ctx.canvas.height,
  };
}

export default function useCanvas(draw: any, click?: any, hover?: any) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current as any;
    const context = canvas.getContext('2d');
    draw(context);
  }, [draw]);

  useEffect(() => {
    if (click) {
      const canvas = canvasRef.current as any;
      const context = canvas.getContext('2d');
      const func = (evt: any) => {
        click(getMousePos(context, evt), context);
      };
      canvas.addEventListener('click', func);
      return () => {
        canvas.removeEventListener('click', func);
      };
    }
  }, [click]);

  useEffect(() => {
    if (hover) {
      const canvas = canvasRef.current as any;
      const context = canvas.getContext('2d');
      const func = (evt: any) => {
        hover(getMousePos(context, evt), context);
      };
      canvas.addEventListener('mousemove', func);
      return () => {
        canvas.removeEventListener('mousemove', func);
      };
    }
  }, [hover]);

  return canvasRef;
}
