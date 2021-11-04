import { useMemo } from 'react';

import { DrawItem } from '../../drawLib/drawItem';
import { ContainerDrawItem } from '../../drawLib/containerDrawItem';
import { BoxDrawItem } from '../../drawLib/boxDrawItem';

import { Property } from 'csstype';
import React from 'react';
import { ColorsConfig, getConfig, IColorsConfig } from '../ColorsConfig';
import { CanvasChart } from '../CanvasChart/CanvasChart';

interface IStackedBarChartConfig extends IColorsConfig {
  barSize?: number;
  gutterSize?: number;
  height?: number | 'auto';
}

interface StackedBarChartConfig extends ColorsConfig {
  barSize: number;
  gutterSize: number;
  height: number | 'auto';
}

const defaultConfig = {
  barSize: 18,
  gutterSize: 5,
  height: 200,
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
  config?: IStackedBarChartConfig;
  tooltip?: React.FC<{ item?: StackedBarChartItemData }>;
  onClick?: (data: StackedBarChartItemData) => void;
};

export function StackedBarChart(props: StackedBarChartProps) {
  const { items, config, tooltip, onClick } = props;

  const theConfig = useMemo(
    () =>
      ({
        ...defaultConfig,
        ...getConfig(config),
      } as StackedBarChartConfig),
    [config]
  );

  const drawItems = useMemo(() => {
    const dItems: Array<DrawItem> = [];
    const COL_SIZE = theConfig.barSize + theConfig.gutterSize;
    const CELL_HEIGHT = theConfig.barSize;
    let HEIGHT_SCALE = 1.0;
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

    if (theConfig.height !== 'auto') {
      HEIGHT_SCALE = theConfig.height / maxHeight;
    }

    items.forEach((item: StackedBarChartData, i: number) => {
      let top =
        HEIGHT_SCALE *
        (maxHeight -
          CELL_HEIGHT *
            item.items.reduce(
              (p: number, c: StackedBarChartItemData) => p + c.value,
              0
            ));
      let h = 0;
      item.items.forEach((sItem: StackedBarChartItemData, j: number) => {
        const ditem = BoxDrawItem.create(
          i * COL_SIZE,
          top,
          theConfig.barSize,
          theConfig.textColor,
          sItem.bgColor,
          theConfig.selBgColor,
          theConfig.borderColor,
          sItem,
          ''
        );
        h = HEIGHT_SCALE * sItem.value * CELL_HEIGHT;
        ditem.height = h;
        top += h;
        dItems.push(ditem);
      });
    });

    const c = new ContainerDrawItem();
    c.items = dItems;
    c.bgColor = theConfig.defaultBgColor;
    c.color = theConfig.textColor;
    return [c];
  }, [items, theConfig]);

  return (
    <CanvasChart
      drawItems={drawItems}
      onClick={onClick}
      theConfig={theConfig}
      tooltip={tooltip}
    ></CanvasChart>
  );
}
