import {
  addMonths,
  isSameDay,
  isWithinInterval,
  isAfter,
  isBefore,
  isSameMonth,
  addYears,
  max,
  min,
} from 'date-fns';

import {
  MARKERS,
  PickerDateRange,
  NavigationAction,
  DefinedRange,
  defaultFormat,
} from './types';
import { Menu } from '../components/Menu';
import { defaultRanges } from './defaults';
import { parseOptionalDate } from './utils';
import { useEffect, useState, memo } from 'react';

const getValidatedMonths = (
  range: PickerDateRange,
  minDate: Date,
  maxDate: Date
) => {
  let { startDate, endDate } = range;
  if (startDate && endDate) {
    const newStart = max([startDate, minDate]);
    const newEnd = min([endDate, maxDate]);

    return [
      newStart,
      isSameMonth(newStart, newEnd) ? addMonths(newStart, 1) : newEnd,
    ];
  } else {
    return [startDate, endDate];
  }
};

export interface DateRangePickerProps {
  dateRange?: PickerDateRange;
  definedRanges?: DefinedRange[];
  minDate?: Date | string;
  maxDate?: Date | string;
  format?: string;
  onChange: (dateRange: PickerDateRange) => void;
  onSelected?: (dateRange: PickerDateRange) => void;
}

export const arEqualDateRangePickerProps = (
  a: DateRangePickerProps,
  b: DateRangePickerProps
) =>
  a.dateRange?.startDate === b.dateRange?.startDate &&
  a.dateRange?.endDate === b.dateRange?.endDate &&
  a.definedRanges?.length === b.definedRanges?.length &&
  a.minDate === b.minDate &&
  a.maxDate === b.maxDate;

export const StaticDateRangePicker = memo((props: DateRangePickerProps) => {
  const today = new Date();

  const {
    onChange,
    onSelected,
    dateRange,
    minDate,
    maxDate,
    definedRanges = defaultRanges,
    format = defaultFormat,
  } = props;

  const minDateValid = parseOptionalDate(minDate, addYears(today, -150));
  const maxDateValid = parseOptionalDate(maxDate, addYears(today, 150));
  const [intialFirstMonth, initialSecondMonth] = getValidatedMonths(
    dateRange || {},
    minDateValid,
    maxDateValid
  );

  const [intDateRange, setIntDateRange] = useState<PickerDateRange>({});
  const [hoverDay, setHoverDay] = useState<Date>();
  const [firstMonth, setFirstMonth] = useState<Date>(intialFirstMonth || today);
  const [secondMonth, setSecondMonth] = useState<Date>(
    initialSecondMonth || addMonths(firstMonth, 1)
  );

  const { startDate, endDate } = intDateRange;

  useEffect(() => {
    setIntDateRange(dateRange!);
  }, [dateRange]);

  useEffect(() => {
    if (onSelected) onSelected(intDateRange);
  }, [intDateRange, onSelected]);

  // handlers
  const setFirstMonthValidated = (date: Date) => {
    if (isBefore(date, secondMonth)) {
      setFirstMonth(date);
    }
  };

  const setSecondMonthValidated = (date: Date) => {
    if (isAfter(date, firstMonth)) {
      setSecondMonth(date);
    }
  };

  const setDateRangeValidated = (range: PickerDateRange) => {
    let { startDate: newStart, endDate: newEnd } = range;
    if (newStart && newEnd) {
      range.startDate = newStart = max([newStart, minDateValid]);
      range.endDate = newEnd = min([newEnd, maxDateValid]);
      setIntDateRange(range);
      onChange(range);
      setFirstMonth(newStart);
      setSecondMonth(
        isSameMonth(newStart, newEnd) ? addMonths(newStart, 1) : newEnd
      );
    }
  };

  const onDayClick = (day: Date) => {
    if (startDate && !endDate && !isBefore(day, startDate)) {
      const newRange = { startDate, endDate: day };
      onChange(newRange);
      setIntDateRange(newRange);
    } else {
      setIntDateRange({ startDate: day, endDate: undefined });
    }
    setHoverDay(day);
  };

  const onMonthNavigate = (marker: string, action: NavigationAction) => {
    if (marker === MARKERS.FIRST_MONTH) {
      const firstNew = addMonths(firstMonth, action);
      if (isBefore(firstNew, secondMonth)) setFirstMonth(firstNew);
    } else {
      const secondNew = addMonths(secondMonth, action);
      if (isBefore(firstMonth, secondNew)) setSecondMonth(secondNew);
    }
  };

  const onDayHover = (date: Date) => {
    if (startDate && !endDate) {
      if (!hoverDay || !isSameDay(date, hoverDay)) {
        setHoverDay(date);
      }
    }
  };

  // helpers
  const inHoverRange = (day: Date) => {
    return (startDate &&
      !endDate &&
      hoverDay &&
      isAfter(hoverDay, startDate) &&
      isWithinInterval(day, {
        start: startDate,
        end: hoverDay,
      })) as boolean;
  };

  const helpers = {
    inHoverRange,
  };

  const handlers = {
    onDayClick,
    onDayHover,
    onMonthNavigate,
  };

  return (
    <Menu
      format={format}
      dateRange={intDateRange}
      minDate={minDateValid}
      maxDate={maxDateValid}
      ranges={definedRanges}
      firstMonth={firstMonth}
      secondMonth={secondMonth}
      setFirstMonth={setFirstMonthValidated}
      setSecondMonth={setSecondMonthValidated}
      setDateRange={setDateRangeValidated}
      helpers={helpers}
      handlers={handlers}
    />
  );
}, arEqualDateRangePickerProps);
