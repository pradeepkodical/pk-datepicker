import { useCallback, useMemo, useRef, useState } from 'react';

import { DrawItem } from '../../drawLib/drawItem';
import CanvasContainer from '../../drawLib/canvasContainer';
import { ContainerDrawItem } from '../../drawLib/containerDrawItem';
import { BoxDrawItem } from '../../drawLib/boxDrawItem';

import { Property } from 'csstype';
import React from 'react';
import { ChartTooltip } from '../ChartTooltip/ChartTooltip';

type StackedBarChartConfig = {
  selBgColor?: Property.Color;
  defaultBgColor?: Property.Color;
  alternateBgColor?: Property.Color;
  textColor?: Property.Color;
  selTextColor?: Property.Color;
  borderColor?: Property.Color;

  barSize?: number;
  gutterSize?: number;
};

const defaultConfig: StackedBarChartConfig = {
  selBgColor: '#dcf5ff',
  defaultBgColor: '#fff',
  alternateBgColor: '#fefefe',
  textColor: '#000',
  selTextColor: '#111',
  borderColor: '#efefef',
  barSize: 18,
  gutterSize: 5,
};

export type StackedBarChartItemData = {
  bgColor: Property.Color;
  key: string;
  value: number;
};

export type StackedBarChartData = {
  key: string;
  items: Array<StackedBarChartItemData>;
};

export type StackedBarChartProps = {
  items: Array<StackedBarChartData>;
  config?: StackedBarChartConfig;
  tooltip?: React.FC<{ item?: StackedBarChartItemData }>;
  onClick?: (data: StackedBarChartItemData) => void;
};

export function StackedBarChart(props: StackedBarChartProps) {
  const { items, config, tooltip, onClick } = props;

  const [selected, setSelected] = useState<StackedBarChartItemData | null>(
    null
  );

  const theConfig = useMemo(() => ({ ...defaultConfig, ...config }), [config]);

  const drawItems = useMemo(() => {
    const dItems: Array<DrawItem> = [];
    const COL_SIZE = (theConfig.barSize || 0) + (theConfig.gutterSize || 0);
    const CELL_HEIGHT = theConfig.barSize || 0;

    const maxHeight =
      CELL_HEIGHT *
      items.reduce(
        (p: number, c: StackedBarChartData) =>
          Math.max(
            p,
            c.items.reduce(
              (p1: number, c1: StackedBarChartItemData) => p1 + c1.value,
              0
            ),
            0
          ),
        0
      );

    items.forEach((item: StackedBarChartData, i: number) => {
      let top =
        maxHeight -
        CELL_HEIGHT *
          item.items.reduce(
            (p: number, c: StackedBarChartItemData) => p + c.value,
            0
          );
      let h = 0;
      item.items.forEach((sItem: StackedBarChartItemData, j: number) => {
        const ditem = BoxDrawItem.create(
          i * COL_SIZE,
          top,
          theConfig.barSize || 5,
          theConfig.textColor || '#111',
          sItem.bgColor || '#fff',
          theConfig.selBgColor || '#fff',
          theConfig.borderColor || '#fff',
          sItem,
          ''
        );
        h = sItem.value * CELL_HEIGHT;
        ditem.height = h;
        top += h;
        dItems.push(ditem);
      });
    });

    const c = new ContainerDrawItem();
    c.items = dItems;
    c.bgColor = theConfig.defaultBgColor || '#fff';
    c.color = theConfig.textColor || '#111';
    return [c];
  }, [items, theConfig]);

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
        backgroundColor: theConfig.defaultBgColor,
        color: theConfig.textColor,
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
