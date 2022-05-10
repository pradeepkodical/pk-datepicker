import {
  getDate,
  isSameMonth,
  isToday,
  format,
  isWithinInterval,
} from 'date-fns';
import {
  chunks,
  getDaysInMonth,
  isStartOfRange,
  isEndOfRange,
  inDateRange,
  isRangeSameDay,
} from './utils';
import { Header } from './Header';
import { Day } from './Day';
import { NavigationAction, PickerDateRange } from './types';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material';

const WEEK_DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const NOOP = () => {};

interface MonthProps {
  value: Date;
  marker: string;
  dateRange: PickerDateRange;
  minDate: Date;
  maxDate: Date;
  navState: [boolean, boolean];
  setValue: (date: Date) => void;
  helpers: {
    inHoverRange: (day: Date) => boolean;
  };
  handlers: {
    onDayClick: (day: Date) => void;
    onDayHover: (day: Date) => void;
    onMonthNavigate: (marker: string, action: NavigationAction) => void;
  };
}

const StyledBox = styled(Box)(({ theme }) => ({
  width: 290,
  '& .weekDaysContainer': {
    marginTop: 10,
    paddingLeft: 30,
    paddingRight: 30,
    display: 'flex',
    justifyContent: 'space-between',
  },
  '& .daysContainer': {
    paddingLeft: 15,
    paddingRight: 15,
    marginTop: 15,
    marginBottom: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    '& .daysRow': {
      display: 'flex',
      justifyContent: 'center',
      '& .selected:first-of-type': {
        borderTopLeftRadius: theme.shape.borderRadius,
        borderBottomLeftRadius: theme.shape.borderRadius,
      },
      '& .selected:last-of-type': {
        borderTopRightRadius: theme.shape.borderRadius,
        borderBottomRightRadius: theme.shape.borderRadius,
      },
    },
  },
}));

export function Month(props: MonthProps) {
  const {
    helpers,
    handlers,
    value: date,
    dateRange,
    marker,
    setValue: setDate,
    minDate,
    maxDate,
  } = props;

  const [back, forward] = props.navState;

  return (
    <StyledBox className={`month-${marker}`}>
      <Box>
        <Header
          dateRange={dateRange}
          minDate={minDate}
          maxDate={maxDate}
          marker={marker}
          date={date}
          setDate={setDate}
          nextDisabled={!forward}
          prevDisabled={!back}
          onClickPrevious={() =>
            handlers.onMonthNavigate(marker, NavigationAction.Previous)
          }
          onClickNext={() =>
            handlers.onMonthNavigate(marker, NavigationAction.Next)
          }
        />

        <Box className={'weekDaysContainer'}>
          {WEEK_DAYS.map((day) => (
            <Typography color='textSecondary' key={day} variant='caption'>
              {day}
            </Typography>
          ))}
        </Box>

        <Box className={'daysContainer'}>
          {chunks(getDaysInMonth(date), 7).map((week, idx) => (
            <Box className={'daysRow'} key={idx}>
              {week.map((day) => {
                const isStart = isStartOfRange(dateRange, day);
                const isEnd = isEndOfRange(dateRange, day);
                const isRangeOneDay = isRangeSameDay(dateRange);
                const highlighted =
                  inDateRange(dateRange, day) || helpers.inHoverRange(day);
                const disabled =
                  !isSameMonth(date, day) ||
                  !isWithinInterval(day, {
                    start: minDate,
                    end: maxDate,
                  });

                return (
                  <Day
                    key={format(day, 'mm-dd-yyyy')}
                    filled={isStart || isEnd}
                    outlined={isToday(day)}
                    highlighted={highlighted && !isRangeOneDay}
                    disabled={disabled}
                    startOfRange={isStart && !isRangeOneDay}
                    endOfRange={isEnd && !isRangeOneDay}
                    onClick={disabled ? NOOP : () => handlers.onDayClick(day)}
                    onHover={disabled ? NOOP : () => handlers.onDayHover(day)}
                    value={getDate(day)}
                  />
                );
              })}
            </Box>
          ))}
        </Box>
      </Box>
    </StyledBox>
  );
}
