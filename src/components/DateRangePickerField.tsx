import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { Divider, styled } from '@mui/material';

import { DateRangePickerProps, StaticDateRangePicker } from './DateRangePicker';
import { useCallback, useEffect, useState } from 'react';
import DateRangeIcon from '@mui/icons-material/DateRange';
import { format as formatDate } from 'date-fns';
import { defaultFormat, PickerDateRange } from './types';

const StyledPickerField = styled(Box)(({ theme }) => ({
  '& > .MuiBox-root': {
    display: 'flex',
    borderRadius: theme.spacing(0.5),
    backgroundColor: theme.palette.grey[200],
    padding: theme.spacing(0, 1),
    alignItems: 'center',
  },
}));

export interface DateRangePickerFieldProps extends DateRangePickerProps {
  label?: string;
  okLabel?: string;
  cancelLabel?: string;
}

export function DateRangePickerField({
  format = defaultFormat,
  label,
  okLabel = 'Ok',
  cancelLabel = 'Cancel',
  minDate,
  maxDate,
  dateRange,
  definedRanges,
  onChange,
  onSelected,
}: DateRangePickerFieldProps) {
  const [intDateRange, setIntDateRange] = useState<PickerDateRange>({});

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const acceptRange = () => {
    onChange(intDateRange);
    setAnchorEl(null);
  };

  useEffect(() => {
    setIntDateRange(dateRange!);
  }, [dateRange]);

  return (
    <StyledPickerField className={'Mui-DateRangePickerField-root'}>
      <Box>
        <Box flex={1}>
          <Typography fontSize={12}>{label}</Typography>
          <Typography fontSize={14}>
            {dateRange && dateRange.startDate
              ? `${formatDate(dateRange.startDate, format)}`
              : 'Start Date'}
            {' - '}
            {dateRange && dateRange.endDate
              ? `${formatDate(dateRange.endDate, format)}`
              : 'End Date'}
          </Typography>
        </Box>
        <Box>
          <IconButton onClick={handleClick}>
            <DateRangeIcon />
          </IconButton>
        </Box>
      </Box>

      <Popover
        className='wnd-popover'
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Paper sx={{ p: 1 }}>
          <StaticDateRangePicker
            dateRange={intDateRange}
            onChange={setIntDateRange}
            onSelected={onSelected}
            minDate={minDate}
            maxDate={maxDate}
            definedRanges={definedRanges}
          />
          <Divider />
          <Box
            sx={{
              p: 1,
              gridGap: 8,
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Button onClick={handleClose}>{cancelLabel}</Button>
            <Button variant='contained' onClick={acceptRange}>
              {okLabel}
            </Button>
          </Box>
        </Paper>
      </Popover>
    </StyledPickerField>
  );
}
