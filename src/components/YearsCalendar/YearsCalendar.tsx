import { useCallback, useMemo, useState } from 'react';

import { format, addDays, getWeek, getDaysInYear } from 'date-fns';

import { DrawItem } from '../../drawLib/drawItem';
import { TextDrawItem } from '../../drawLib/textDrawItem';
import { groupBy } from '../../utils/helperUtil';
import CanvasContainer from '../../drawLib/canvasContainer';
import { ContainerDrawItem } from '../../drawLib/containerDrawItem';
import { BoxDrawItem } from '../../drawLib/boxDrawItem';
import { GridDrawItem } from '../../drawLib/gridDrawItem';

import { Property } from 'csstype';

import { ChartTooltip } from '../ChartTooltip/ChartTooltip';
import React from 'react';
import { ColorsConfig, getConfig, IColorsConfig } from '../ColorsConfig';

interface IYearsCalendarConfig extends IColorsConfig {
  cellSize?: number;
}
interface YearsCalendarConfig extends ColorsConfig {
  cellSize: number;
}
const defaultConfig = {
  cellSize: 25,
};

export type YearCalendarData = {
  date: Date;
  bgColor: Property.Color;
};

function getLocation(date: Date, config: YearsCalendarConfig) {
  const top = date.getDay() * config.cellSize;
  let w = getWeek(date);
  if (date.getMonth() > 10 && w < 45) w = 53;
  const left = w * config.cellSize;
  return { top, left };
}

function getWeekDayHeader(config: YearsCalendarConfig) {
  const arr: Array<DrawItem> = [];
  ['S', 'M', 'T', 'W', 'T', 'F', 'S'].forEach((x: string, idx: number) => {
    arr.push(
      TextDrawItem.create(
        config.cellSize,
        (idx + 1) * config.cellSize,
        config.cellSize,
        config.textColor,
        config.defaultBgColor,
        x,
        {}
      )
    );
  });
  return arr;
}

function getMonthsHeader(year: number, config: YearsCalendarConfig) {
  const startDate = new Date(year, 0, 15);
  const arr: Array<DrawItem> = [];
  for (var i = 0; i < 12; i++) {
    startDate.setMonth(i);
    let w = getWeek(startDate);
    if (i > 10 && w < 45) w = 53;

    arr.push(
      TextDrawItem.create(
        (1 + w) * config.cellSize,
        0,
        config.cellSize,
        config.textColor || '#111',
        config.defaultBgColor || '#fff',
        format(startDate, 'MMM'),
        {}
      )
    );
  }
  return arr;
}

function YearBox(props: {
  year: number;
  items: Array<YearCalendarData>;
  config: YearsCalendarConfig;
  onClick?: (item: any) => void;
  onHover?: (item: any) => void;
}) {
  const { year, items, onClick, onHover, config } = props;

  const drawItems = useMemo(() => {
    let startDate = new Date(year, 0, 15);
    const arr: Array<DrawItem> = [
      ...getWeekDayHeader(config),
      ...getMonthsHeader(year, config),
    ];

    startDate = new Date(year, 0, 1);
    const maxDays = getDaysInYear(startDate);

    const allData: any = {};
    items.forEach((a: any) => {
      const index = a.date.toDateString();
      if (!allData[index]) allData[index] = [];
      allData[index].push(a);
    });

    for (let i = 0; i < maxDays; i++) {
      const loc = getLocation(startDate, config);
      let bgColor =
        startDate.getMonth() % 2 === 0
          ? config.defaultBgColor
          : config.alternateBgColor;
      const index = startDate.toDateString();
      if (allData[index]) {
        const item = GridDrawItem.create(
          loc.top + config.cellSize,
          loc.left + config.cellSize,
          config.cellSize - 2,
          config.selTextColor,
          bgColor,
          config.selBgColor,
          config.borderColor,
          allData[index],
          `${startDate.getDate()}`
        );
        arr.push(item);
      } else {
        const item = BoxDrawItem.create(
          loc.left + config.cellSize,
          loc.top + config.cellSize,
          config.cellSize - 2,
          config.textColor,
          bgColor,
          config.selBgColor,
          config.borderColor,
          '',
          `${startDate.getDate()}`
        );
        arr.push(item);
      }
      startDate = addDays(startDate, 1);
    }

    const c = new ContainerDrawItem();
    c.items = arr;
    c.bgColor = config.defaultBgColor;
    c.color = config.textColor;
    return [c];
  }, [year, items, config]);

  return (
    <div
      style={{
        display: 'flex',
        padding: '10px',
        justifyContent: 'center',
        backgroundColor: config.background,
        color: config.color,
      }}
    >
      <div>
        <div
          style={{
            fontWeight: 'bold',
            fontSize: 'x-large',
            transform: `translateY(${config.cellSize * 4}px) rotate(-90deg)`,
          }}
        >
          {year}
        </div>
      </div>
      <CanvasContainer
        drawItems={drawItems}
        onClick={onClick}
        onHover={onHover}
      />
    </div>
  );
}

export type YearsCalendarProps = {
  items: Array<YearCalendarData>;
  config?: IYearsCalendarConfig;
  onClick?: (data: YearCalendarData | null) => void;
  onHover?: (data: YearCalendarData | null) => void;
  tooltip?: React.FC<{ item?: YearCalendarData }>;
};

export function YearsCalendar(props: YearsCalendarProps) {
  const { items, config, onClick, onHover, tooltip } = props;

  const [selected, setSelected] = useState<YearCalendarData | null>(null);
  const groupedItems = useMemo(
    () => groupBy(items, (item: YearCalendarData) => item.date.getFullYear()),
    [items]
  );

  const theConfig = useMemo(
    () =>
      ({
        ...defaultConfig,
        ...getConfig(config),
      } as YearsCalendarConfig),
    [config]
  );

  const handleHover = useCallback(
    (item: any) => {
      setSelected(item);
      if (onHover) onHover(item);
    },
    [setSelected, onHover]
  );

  return (
    <div
      style={{
        padding: '10px',
        backgroundColor: theConfig.background,
        color: theConfig.color,
      }}
    >
      {Object.keys(groupedItems).map((key: any, i: number) => (
        <div key={i}>
          <YearBox
            year={key}
            items={groupedItems[key]}
            config={theConfig}
            onClick={onClick}
            onHover={handleHover}
          />
        </div>
      ))}
      <ChartTooltip tooltip={tooltip} selected={selected} />
    </div>
  );
}
