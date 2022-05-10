import { setMonth, getMonth, setYear, getYear } from 'date-fns';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { MARKERS, PickerDateRange } from './types';
import { styled } from '@mui/material';

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

export function Header({
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
}: HeaderProps) {
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
    <Box display='flex' alignItems={'center'} justifyContent={'space-between'}>
      <Box>
        <IconButton disabled={disablePrev} onClick={onClickPrevious}>
          <ChevronLeft color={disablePrev ? 'disabled' : 'action'} />
        </IconButton>
      </Box>
      <Box>
        <StyledSelect
          size='small'
          variant='standard'
          value={getMonth(date)}
          onChange={handleMonthChange}
          IconComponent={ExpandMoreIcon}
        >
          {MONTHS.map((month, idx) => (
            <MenuItem key={month} value={idx}>
              {month}
            </MenuItem>
          ))}
        </StyledSelect>
      </Box>

      <Box>
        <StyledSelect
          size='small'
          variant='standard'
          value={getYear(date)}
          onChange={handleYearChange}
          MenuProps={{ disablePortal: true }}
          IconComponent={ExpandMoreIcon}
        >
          {generateYears(theDate, delta, count).map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </StyledSelect>
      </Box>
      <Box>
        <IconButton disabled={disableNext} onClick={onClickNext}>
          <ChevronRight color={disableNext ? 'disabled' : 'action'} />
        </IconButton>
      </Box>
    </Box>
  );
}
