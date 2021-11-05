import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import CanvasContainer from '../../drawLib/canvasContainer';
import { DrawItem } from '../../drawLib/drawItem';
import { ChartTooltip } from '../ChartTooltip/ChartTooltip';
import { ColorsConfig } from '../ColorsConfig';

interface CanvasChartProps {
  theConfig: ColorsConfig;
  getDrawItems: (width: number) => Array<DrawItem>;
  tooltip?: React.FC<{ item?: any }>;
  onClick?: (data: any) => void;
}
export function CanvasChart(props: CanvasChartProps) {
  const { getDrawItems, theConfig, tooltip, onClick } = props;
  const [selected, setSelected] = useState<any>();
  const [width, setWidth] = useState(0);
  const ref = useRef<any>();
  const handleOnHover = useCallback(
    (item: any) => {
      setSelected(item);
    },
    [setSelected]
  );

  useEffect(() => {
    if (ref.current) {
      setWidth(ref.current.offsetWidth);
    }
  }, [ref, setWidth]);

  const drawItems = useMemo(() => (width > 0 ? getDrawItems(width - 40) : []), [
    getDrawItems,
    width,
  ]);

  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        padding: '10px',
        justifyContent: 'stretch',
        backgroundColor: theConfig.background,
        color: theConfig.color,
      }}
    >
      <CanvasContainer
        drawItems={drawItems}
        onClick={onClick}
        onHover={handleOnHover}
      ></CanvasContainer>
      <ChartTooltip tooltip={tooltip} selected={selected} />
    </div>
  );
}
