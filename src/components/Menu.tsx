import { format as formatDate, differenceInCalendarMonths } from 'date-fns';

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import ArrowRightAlt from '@mui/icons-material/ArrowRightAlt';

import { Month } from './Month';
import { DefinedRanges } from './DefinedRanges';
import {
  PickerDateRange,
  DefinedRange,
  Setter,
  NavigationAction,
  MARKERS,
} from './types';

interface MenuProps {
  format: string;
  dateRange: PickerDateRange;
  ranges: DefinedRange[];
  minDate: Date;
  maxDate: Date;
  firstMonth: Date;
  secondMonth: Date;
  setFirstMonth: Setter<Date>;
  setSecondMonth: Setter<Date>;
  setDateRange: Setter<PickerDateRange>;
  helpers: {
    inHoverRange: (day: Date) => boolean;
  };
  handlers: {
    onDayClick: (day: Date) => void;
    onDayHover: (day: Date) => void;
    onMonthNavigate: (marker: string, action: NavigationAction) => void;
  };
}

export function Menu(props: MenuProps) {
  const {
    format,
    ranges,
    dateRange,
    minDate,
    maxDate,
    firstMonth,
    setFirstMonth,
    secondMonth,
    setSecondMonth,
    setDateRange,
    helpers,
    handlers,
  } = props;
  const { startDate, endDate } = dateRange;
  const canNavigateCloser =
    differenceInCalendarMonths(secondMonth, firstMonth) >= 2;
  const commonProps = { dateRange, minDate, maxDate, helpers, handlers };

  return (
    <Box sx={{ p: 1 }}>
      <Box display='flex' justifyContent={'center'} alignItems={'center'}>
        <Box>
          <Typography variant='subtitle1'>
            {startDate ? formatDate(startDate, format) : 'Start Date'}
          </Typography>
        </Box>
        <Box pl={1} pr={1} display={'flex'}>
          <ArrowRightAlt color='action' />
        </Box>
        <Box>
          <Typography variant='subtitle1'>
            {endDate ? formatDate(endDate, format) : 'End Date'}
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ mt: 1, mb: 1 }} />
      <Box
        display='flex'
        flexDirection='row'
        flexWrap='nowrap'
        sx={{ overflowX: 'auto', width: '100%' }}
      >
        <Box flex={1}>
          <Box display='flex' flexWrap={'nowrap'} overflow={'auto'}>
            <Month
              {...commonProps}
              value={firstMonth}
              setValue={setFirstMonth}
              navState={[true, canNavigateCloser]}
              marker={MARKERS.FIRST_MONTH}
            />
            <Divider orientation='vertical' flexItem />
            <Month
              {...commonProps}
              value={secondMonth}
              setValue={setSecondMonth}
              navState={[canNavigateCloser, true]}
              marker={MARKERS.SECOND_MONTH}
            />
          </Box>
        </Box>
        {ranges && ranges.length > 0 && (
          <>
            <Divider orientation='vertical' flexItem />
            <Box minWidth={120}>
              <DefinedRanges
                selectedRange={dateRange}
                ranges={ranges}
                setRange={setDateRange}
              />
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}
