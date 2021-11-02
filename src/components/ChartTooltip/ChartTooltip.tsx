import { createElement } from 'react';
import useDelayResetState from '../../hooks/useDelayResetState';
import { useFollowMouse } from '../../hooks/useMousePosition';

export function ChartTooltip(props: {
  selected: any;
  tooltip?: React.FC<{ item?: any }>;
}) {
  const { selected, tooltip } = props;
  const ref = useFollowMouse();

  const value = useDelayResetState(selected, 3000);

  return tooltip && value ? (
    <div
      ref={ref}
      style={{
        padding: '10px',
        position: 'fixed',
        zIndex: 10000,
      }}
    >
      {createElement(tooltip, { item: value })}
    </div>
  ) : (
    <></>
  );
}
