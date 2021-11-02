import { useEffect, useRef, useState } from 'react';

export default function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const setFromEvent = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', setFromEvent);

    return () => {
      window.removeEventListener('mousemove', setFromEvent);
    };
  }, []);

  return position;
}

export function useFollowMouse() {
  const ref = useRef<any>();
  useEffect(() => {
    const setFromEvent = (e: MouseEvent) => {
      const elm = ref.current;
      if (elm && elm.style) {
        let left = e.clientX;
        let top = e.clientY;

        if (e.clientX + elm.offsetWidth > window.innerWidth) {
          left = window.innerWidth - elm.offsetWidth;
        }
        if (e.clientY + elm.offsetHeight > window.innerWidth) {
          top = window.innerHeight - elm.offsetHeight;
        }

        elm.style.left = `${left}px`;
        elm.style.top = `${top}px`;
      }
    };
    window.addEventListener('mousemove', setFromEvent);

    return () => {
      window.removeEventListener('mousemove', setFromEvent);
    };
  }, [ref]);
  return ref;
}
