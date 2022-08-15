import { memo } from 'react';
import { setMonth, getMonth, setYear, getYear } from 'date-fns';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import { MARKERS, PickerDateRange } from './types';
import { styled } from '@mui/material';
import { ArrowLeftIcon, ArrowRightIcon, ArrowDownIcon } from './icons';

interface HeaderProps {
  dateRange: PickerDateRange;
  minDate: Date;
  maxDate: Date;
  marker: string;

  date: Date;
  setDate: (date: Date) => void;
  nextDisabled: boolean;
  prevDisabled: boolean;
  onClickNext: () => void;
  onClickPrevious: () => void;
}

export const arEqualHeaderProps = (a: HeaderProps, b: HeaderProps) =>
  a.dateRange?.startDate === b.dateRange?.startDate &&
  a.dateRange?.endDate === b.dateRange?.endDate &&
  a.date === b.date &&
  a.minDate === b.minDate &&
  a.maxDate === b.maxDate;

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'June',
  'July',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec',
];

const generateYears = (relativeTo: Date, delta: number, count: number) => {
  const retArray = Array(count + 1)
    .fill(0)
    .map((y, i) => relativeTo.getFullYear() + delta * i);

  return delta === -1 ? retArray.reverse() : retArray;
};

const StyledSelect = styled(Select)(({ theme }) => ({
  '&::before, &::after': {
    border: '0 !important',
  },
}));

export const Header = memo(
  ({
    dateRange,
    minDate,
    maxDate,
    marker,
    date,
    setDate,
    nextDisabled,
    prevDisabled,
    onClickNext,
    onClickPrevious,
  }: HeaderProps) => {
    const handleMonthChange = (event: any) => {
      setDate(setMonth(date, parseInt(event.target.value as string)));
    };

    const handleYearChange = (event: any) => {
      setDate(setYear(date, parseInt(event.target.value as string)));
    };

    const delta = marker === MARKERS['FIRST_MONTH'] ? -1 : 1;
    const theDate =
      (delta === -1 ? dateRange.endDate : dateRange.startDate) ?? date;
    const count = Math.abs(
      (delta === -1 ? minDate : maxDate).getFullYear() - theDate.getFullYear()
    );

    const disablePrev =
      prevDisabled ||
      date.getFullYear() < minDate.getFullYear() ||
      (date.getFullYear() === minDate.getFullYear() &&
        date.getMonth() <= minDate.getMonth());

    const disableNext =
      nextDisabled ||
      date >= maxDate ||
      (date.getFullYear() === maxDate.getFullYear() &&
        date.getMonth() >= maxDate.getMonth());

    return (
      <Box
        display='flex'
        alignItems={'center'}
        justifyContent={'space-between'}
      >
        <div>
          <IconButton disabled={disablePrev} onClick={onClickPrevious}>
            <ArrowLeftIcon color={disablePrev ? 'disabled' : 'action'} />
          </IconButton>
        </div>
        <div>
          <StyledSelect
            size='small'
            variant='standard'
            value={getMonth(date)}
            onChange={handleMonthChange}
            IconComponent={ArrowDownIcon}
          >
            {MONTHS.map((month, idx) => (
              <MenuItem key={month} value={idx}>
                {month}
              </MenuItem>
            ))}
          </StyledSelect>
        </div>

        <div>
          <StyledSelect
            size='small'
            variant='standard'
            value={getYear(date)}
            onChange={handleYearChange}
            MenuProps={{ disablePortal: true }}
            IconComponent={ArrowDownIcon}
          >
            {generateYears(theDate, delta, count).map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </StyledSelect>
        </div>
        <div>
          <IconButton disabled={disableNext} onClick={onClickNext}>
            <ArrowRightIcon color={disableNext ? 'disabled' : 'action'} />
          </IconButton>
        </div>
      </Box>
    );
  },
  arEqualHeaderProps
);
