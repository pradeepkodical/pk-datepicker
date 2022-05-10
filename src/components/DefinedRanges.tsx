import { DefinedRange, PickerDateRange } from './types';
import { isSameDay } from 'date-fns';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

type DefinedRangesProps = {
  setRange: (range: PickerDateRange) => void;
  selectedRange: PickerDateRange;
  ranges: DefinedRange[];
};

const isSameRange = (first: PickerDateRange, second: PickerDateRange) => {
  const { startDate: fStart, endDate: fEnd } = first;
  const { startDate: sStart, endDate: sEnd } = second;
  if (fStart && sStart && fEnd && sEnd) {
    return isSameDay(fStart, sStart) && isSameDay(fEnd, sEnd);
  }
  return false;
};

export function DefinedRanges(props: DefinedRangesProps) {
  return (
    <List>
      {props.ranges.map((range, idx) => (
        <ListItem button key={idx} onClick={() => props.setRange(range)}>
          <ListItemText
            primaryTypographyProps={{
              variant: 'body2',
              style: {
                fontWeight: isSameRange(range, props.selectedRange)
                  ? 'bold'
                  : 'normal',
              },
            }}
          >
            {range.label}
          </ListItemText>
        </ListItem>
      ))}
    </List>
  );
}
