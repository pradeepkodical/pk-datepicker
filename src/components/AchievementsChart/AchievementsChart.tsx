import { useCallback, useMemo, useState } from 'react';

import { DrawItem } from '../../drawLib/drawItem';
import CanvasContainer from '../../drawLib/canvasContainer';
import { ContainerDrawItem } from '../../drawLib/containerDrawItem';
import { BoxDrawItem } from '../../drawLib/boxDrawItem';

import { Property } from 'csstype';
import React from 'react';
import { ChartTooltip } from '../ChartTooltip/ChartTooltip';
import { TextDrawItem } from '../../drawLib/textDrawItem';
import {
  IColorsConfig,
  ColorsConfig,
  getConfig,
  DefaultColorOrFunc,
} from '../ColorsConfig';
import { CanvasChart } from '../CanvasChart/CanvasChart';

interface IAchievementsChartConfig extends IColorsConfig {
  rowSize?: number;
  boxSize?: number;
}

const defaultConfig = {
  rowSize: 25,
  boxSize: 18,
};

interface AchievementsChartConfig extends ColorsConfig {
  rowSize: number;
  boxSize: number;
}

export type AchievementsChartItemData = {
  bgColor: Property.Color;
  badgeCount?: number;
  data?: any;
};

export type AchievementsChartData = {
  bgColor: Property.Color;
  id: string;
  name: string;
  badges: Array<AchievementsChartItemData>;
  timeline: Array<AchievementsChartItemData>;
};

export type AchievementsChartProps = {
  items: Array<AchievementsChartData>;
  config?: IAchievementsChartConfig;
  tooltip?: React.FC<{
    item?: { item: AchievementsChartData; badge?: AchievementsChartItemData };
  }>;
  onClick?: (data: AchievementsChartItemData) => void;
};

function createLineItem(
  item: AchievementsChartData,
  top: number,
  theConfig: AchievementsChartConfig,
  bgColor: DefaultColorOrFunc
) {
  const c = new ContainerDrawItem();
  c.items = [];
  c.bgColor = bgColor;
  c.top = top;
  c.left = 0;
  c.data = { item };

  const ROW_HEIGHT = theConfig.rowSize;
  const BOX_SIZE = theConfig.boxSize;

  item.badges?.forEach((b: AchievementsChartItemData, j: number) => {
    const bd = BoxDrawItem.create(
      j * BOX_SIZE,
      top + (ROW_HEIGHT - BOX_SIZE) / 2,
      BOX_SIZE,
      theConfig.textColor,
      b.bgColor,
      theConfig.selBgColor,
      theConfig.borderColor,
      { item, badge: b },
      ''
    );
    c.items.push(bd);
  });

  //Create Name
  c.items.push(
    TextDrawItem.create(
      5 * BOX_SIZE,
      top,
      ROW_HEIGHT,
      theConfig.textColor,
      bgColor,
      item.name,
      { item }
    )
  );
  //Create Timelines
  item.timeline?.forEach((b: AchievementsChartItemData, j: number) => {
    const bd = BoxDrawItem.create(
      200 + j * BOX_SIZE,
      top + (ROW_HEIGHT - BOX_SIZE) / 2,
      BOX_SIZE,
      theConfig.textColor,
      b.bgColor,
      theConfig.selBgColor,
      theConfig.borderColor,
      { item, badge: b },
      ''
    );
    c.items.push(bd);

    if (b.badgeCount && b.badgeCount > 0) {
      const bg1 = BoxDrawItem.create(
        200 + j * BOX_SIZE + (BOX_SIZE - 5) / 2,
        top + (ROW_HEIGHT - BOX_SIZE) / 2 - 5 / 2,
        5,
        theConfig.textColor,
        'green',
        theConfig.selBgColor,
        theConfig.borderColor,
        { item, badge: b },
        ''
      );
      bd.sideKick = bg1;
      c.items.push(bg1);
    }
  });
  return c;
}

function createDrawItems(
  items: Array<AchievementsChartData>,
  theConfig: AchievementsChartConfig
) {
  const dItems: Array<DrawItem> = [];

  const width = items.reduce(
    (p1: number, c: AchievementsChartData) =>
      Math.max(
        p1,
        c.badges.length + c.timeline.length * (theConfig.boxSize || 20) + 200
      ),
    0
  );

  items.forEach((item: AchievementsChartData, index: number) => {
    const c1 = createLineItem(
      item,
      index * (theConfig.rowSize || 25),
      theConfig,
      index % 2 === 0 ? theConfig.defaultBgColor : theConfig.alternateBgColor
    );
    c1.width = width;
    dItems.push(c1);
  });

  return dItems;
}

export function AchievementsChart(props: AchievementsChartProps) {
  const { items, config, tooltip, onClick } = props;

  const theConfig = useMemo(
    () =>
      ({
        ...defaultConfig,
        ...getConfig(config),
      } as AchievementsChartConfig),
    [config]
  );

  const drawItems = useMemo(() => createDrawItems(items, theConfig), [
    items,
    theConfig,
  ]);

  return (
    <CanvasChart
      drawItems={drawItems}
      onClick={onClick}
      theConfig={theConfig}
      tooltip={tooltip}
    ></CanvasChart>
  );
}
