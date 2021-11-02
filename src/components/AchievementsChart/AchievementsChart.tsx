import { useCallback, useMemo, useState } from 'react';

import { DrawItem } from '../../drawLib/drawItem';
import CanvasContainer from '../../drawLib/canvasContainer';
import { ContainerDrawItem } from '../../drawLib/containerDrawItem';
import { BoxDrawItem } from '../../drawLib/boxDrawItem';

import { Property } from 'csstype';
import React from 'react';
import { ChartTooltip } from '../ChartTooltip/ChartTooltip';
import { TextDrawItem } from '../../drawLib/textDrawItem';

type AchievementsChartConfig = {
  selBgColor?: Property.Color;
  defaultBgColor?: Property.Color;
  alternateBgColor?: Property.Color;
  textColor?: Property.Color;
  selTextColor?: Property.Color;
  borderColor?: Property.Color;

  rowSize?: number;
  boxSize?: number;
};

const defaultConfig: AchievementsChartConfig = {
  selBgColor: '#dcf5ff',
  defaultBgColor: '#fff',
  alternateBgColor: '#fefefe',
  textColor: '#000',
  selTextColor: '#111',
  borderColor: '#efefef',
  rowSize: 25,
  boxSize: 18,
};

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
  config?: AchievementsChartConfig;
  tooltip?: React.FC<{
    item?: { item: AchievementsChartData; badge?: AchievementsChartItemData };
  }>;
  onClick?: (data: AchievementsChartItemData) => void;
};

function createLineItem(
  item: AchievementsChartData,
  top: number,
  theConfig: AchievementsChartConfig,
  bgColor: Property.Color
) {
  const c = new ContainerDrawItem();
  c.items = [];
  c.bgColor = bgColor;
  c.top = top;
  c.left = 0;
  c.data = { item };

  const ROW_HEIGHT = theConfig.rowSize || 25;
  const BOX_SIZE = theConfig.boxSize || 18;

  //c.color = theConfig.textColor || '#111';
  //Create Badges

  item.badges?.forEach((b: AchievementsChartItemData, j: number) => {
    const bd = BoxDrawItem.create(
      j * BOX_SIZE,
      top + (ROW_HEIGHT - BOX_SIZE) / 2,
      BOX_SIZE,
      theConfig.textColor || '#333',
      b.bgColor,
      theConfig.selBgColor || '#fff',
      theConfig.borderColor || '#666',
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
      theConfig.textColor || '#333',
      bgColor || '#fff',
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
      theConfig.textColor || '#333',
      b.bgColor,
      theConfig.selBgColor || '#fff',
      theConfig.borderColor || '#666',
      { item, badge: b },
      ''
    );
    c.items.push(bd);

    if (b.badgeCount && b.badgeCount > 0) {
      const bg1 = BoxDrawItem.create(
        200 + j * BOX_SIZE + (BOX_SIZE - 5) / 2,
        top + (ROW_HEIGHT - BOX_SIZE) / 2 - 5 / 2,
        5,
        theConfig.textColor || '#333',
        'green',
        theConfig.selBgColor || '#fff',
        theConfig.borderColor || '#666',
        { item, badge: b },
        ''
      );
      bd.sideKick = bg1;
      c.items.push(bg1);
    }
  });
  return c;
}

export function AchievementsChart(props: AchievementsChartProps) {
  const { items, config, tooltip, onClick } = props;

  const [selected, setSelected] = useState<AchievementsChartItemData | null>(
    null
  );

  const theConfig = useMemo(() => ({ ...defaultConfig, ...config }), [config]);

  const drawItems = useMemo(() => {
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
        (index % 2 === 0
          ? theConfig.defaultBgColor
          : theConfig.alternateBgColor) || '#fff'
      );
      c1.width = width;
      dItems.push(c1);
    });

    return dItems;
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
