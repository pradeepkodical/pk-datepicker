import { useCallback, useState } from 'react';
import CanvasContainer from '../../drawLib/canvasContainer';
import { DrawItem } from '../../drawLib/drawItem';
import { ChartTooltip } from '../ChartTooltip/ChartTooltip';
import { ColorsConfig } from '../ColorsConfig';

interface CanvasChartProps {
  theConfig: ColorsConfig;
  drawItems: Array<DrawItem>;
  tooltip?: React.FC<{ item?: any }>;
  onClick?: (data: any) => void;
}
export function CanvasChart(props: CanvasChartProps) {
  const { drawItems, theConfig, tooltip, onClick } = props;
  const [selected, setSelected] = useState<any>();
  const handleOnHover = useCallback(
    (item: any) => {
      setSelected(item);
    },
    [setSelected]
  );

  return (
    <div
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
