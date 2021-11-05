import React, { useCallback, useMemo } from 'react';
import { differenceInSeconds } from 'date-fns';
import { ContainerDrawItem } from '../../drawLib/containerDrawItem';
import { BoxDrawItem } from '../../drawLib/boxDrawItem';

import { DrawItem } from '../../drawLib/drawItem';

import {
  DefaultColorOrFunc,
  IColorsConfig,
  ColorsConfig,
  getConfig,
  StringColorOrFunc,
} from '../ColorsConfig';
import { CanvasChart } from '../CanvasChart/CanvasChart';

export interface IBasicGantChartConfig extends IColorsConfig {
  colSize?: number;
  rowSize?: number;
  itemSize?: number;
  fontSize?: number;
  itemColor?: StringColorOrFunc;
}

const defaultConfig = {
  colSize: 60,
  rowSize: 40,
  itemSize: 25,
  fontSize: 12,
  itemColor: 'blue',
};

interface BasicGantChartConfig extends ColorsConfig {
  colSize: number;
  rowSize: number;
  itemSize: number;
  fontSize: number;
  itemColor: DefaultColorOrFunc;
}

function createItem(
  item: BasicGantChartData,
  top: number,
  minStartDate: Date,
  maxEndDate: Date,
  nameWidth: number,
  cWidth: number,

  bgColor: DefaultColorOrFunc,
  theConfig: BasicGantChartConfig
) {
  const c = new ContainerDrawItem();
  c.top = top;
  c.height = theConfig.rowSize;
  c.bgColor = bgColor;
  c.items = [];
  c.width = cWidth;
  const t = differenceInSeconds(minStartDate, maxEndDate);
  const s = differenceInSeconds(minStartDate, item.startDate);
  const e = differenceInSeconds(minStartDate, item.endDate);

  c.items.push(
    BoxDrawItem.create(
      0,
      top,
      nameWidth,
      theConfig.textColor,
      item.bgColor || bgColor,
      theConfig.selBgColor,
      theConfig.borderColor,
      item,
      item.name
    )
      .setHeight(theConfig.rowSize)
      .setTextAlign('left')
      .setFont(`${theConfig.fontSize}px Verdana`)
  );

  const maxWidth = Math.max(
    cWidth - nameWidth - theConfig.rowSize,
    2.2 * nameWidth
  );
  const left = maxWidth * (s / t);
  const width = Math.max(15, maxWidth * (e / t) - left);

  c.items.push(
    BoxDrawItem.create(
      left,
      top,
      width,
      theConfig.textColor,
      item.itemBgColor || theConfig.itemColor,
      theConfig.selBgColor,
      theConfig.borderColor,
      item,
      ''
    )
      .setHeight(theConfig.itemSize)
      .moveBy(nameWidth, (theConfig.rowSize - theConfig.itemSize) / 2)
  );
  return c;
}

export type BasicGantChartData = {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  data?: any;
  itemBgColor?: StringColorOrFunc;
  bgColor?: StringColorOrFunc;
};

export type BasicGantChartProps = {
  items: Array<BasicGantChartData>;
  config?: IBasicGantChartConfig;
  tooltip?: React.FC<{ item?: BasicGantChartData }>;
  onClick?: (data: BasicGantChartData) => void;
};

function createDrawItems(
  items: Array<BasicGantChartData>,
  theConfig: BasicGantChartConfig,
  width: number
) {
  const arr: Array<DrawItem> = [];

  const minStartDate: Date = items.reduce(
    (p: any, c: any) => (p < c.startDate ? p : c.startDate),
    new Date()
  );

  const maxStartDate: Date = items.reduce(
    (p: any, c: any) => (p > c.startDate ? p : c.startDate),
    new Date()
  );

  const maxEndDate: Date = items.reduce(
    (p: any, c: any) => (p > c.endDate ? p : c.endDate),
    maxStartDate
  );

  const nameWidth = items.reduce(
    (p: number, c: BasicGantChartData) =>
      Math.max(p, c.name.length * theConfig.fontSize * 0.7),
    0
  );

  items.forEach((item: BasicGantChartData, i: number) => {
    arr.push(
      createItem(
        item,
        i * theConfig.rowSize,
        minStartDate,
        maxEndDate,
        nameWidth,
        width,
        i % 2 === 0 ? theConfig.alternateBgColor : theConfig.defaultBgColor,
        theConfig
      )
    );
  });
  const c = new ContainerDrawItem();
  c.items = arr;
  c.height = c.getHeight();
  c.width = c.getWidth();
  return [c];
}
export function BasicGantChart(props: BasicGantChartProps) {
  const { items, config, tooltip, onClick } = props;

  const theConfig = useMemo(
    () =>
      ({
        ...defaultConfig,
        ...getConfig(config),
      } as BasicGantChartConfig),
    [config]
  );

  const getDrawItems = useCallback(
    (width: number) => createDrawItems(items, theConfig, width),
    [items, theConfig]
  );

  return (
    <CanvasChart
      getDrawItems={getDrawItems}
      onClick={onClick}
      theConfig={theConfig}
      tooltip={tooltip}
    ></CanvasChart>
  );
}
