import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { toDate, isValid, parseISO, isSameDay, isWithinInterval, startOfWeek, startOfMonth, endOfWeek, endOfMonth, isBefore, addDays, getMonth, getYear, setMonth, setYear, isSameMonth, isToday, getDate, format, differenceInCalendarMonths, addWeeks, addMonths, addYears, max, min, isAfter } from 'date-fns';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import ArrowRightAlt from '@mui/icons-material/ArrowRightAlt';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled, Divider as Divider$1 } from '@mui/material';
import { __rest } from 'tslib';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { useState, useEffect, useCallback } from 'react';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Popover from '@mui/material/Popover';
import DateRangeIcon from '@mui/icons-material/DateRange';

var NavigationAction;
(function (NavigationAction) {
    NavigationAction[NavigationAction["Previous"] = -1] = "Previous";
    NavigationAction[NavigationAction["Next"] = 1] = "Next";
})(NavigationAction || (NavigationAction = {}));
const MARKERS = {
    FIRST_MONTH: 'firstMonth',
    SECOND_MONTH: 'secondMonth',
};
const defaultFormat = 'MM/dd/yyyy';

const chunks = (array, size) => {
    return Array.from({ length: Math.ceil(array.length / size) }, (v, i) => array.slice(i * size, i * size + size));
};
// Date
const getDaysInMonth = (date) => {
    const startWeek = startOfWeek(startOfMonth(date));
    const endWeek = endOfWeek(endOfMonth(date));
    const days = [];
    for (let curr = startWeek; isBefore(curr, endWeek);) {
        days.push(curr);
        curr = addDays(curr, 1);
    }
    return days;
};
const isStartOfRange = ({ startDate }, day) => (startDate && isSameDay(day, startDate));
const isEndOfRange = ({ endDate }, day) => (endDate && isSameDay(day, endDate));
const inDateRange = ({ startDate, endDate }, day) => (startDate &&
    endDate &&
    (isWithinInterval(day, {
        start: startDate,
        end: endDate
    }) ||
        isSameDay(day, startDate) ||
        isSameDay(day, endDate)));
const isRangeSameDay = ({ startDate, endDate }) => {
    if (startDate && endDate) {
        return isSameDay(startDate, endDate);
    }
    return false;
};
const parseOptionalDate = (date, defaultValue) => {
    if (date instanceof Date) {
        const parsed = toDate(date);
        if (isValid(parsed))
            return parsed;
    }
    if (date instanceof String) {
        const parsed = parseISO(date);
        if (isValid(parsed))
            return parsed;
    }
    return defaultValue;
};

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
const generateYears = (relativeTo, delta, count) => {
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
function Header({ dateRange, minDate, maxDate, marker, date, setDate, nextDisabled, prevDisabled, onClickNext, onClickPrevious, }) {
    var _a;
    const handleMonthChange = (event) => {
        setDate(setMonth(date, parseInt(event.target.value)));
    };
    const handleYearChange = (event) => {
        setDate(setYear(date, parseInt(event.target.value)));
    };
    const delta = marker === MARKERS['FIRST_MONTH'] ? -1 : 1;
    const theDate = (_a = (delta === -1 ? dateRange.endDate : dateRange.startDate)) !== null && _a !== void 0 ? _a : date;
    const count = Math.abs((delta === -1 ? minDate : maxDate).getFullYear() - theDate.getFullYear());
    const disablePrev = prevDisabled ||
        date.getFullYear() < minDate.getFullYear() ||
        (date.getFullYear() === minDate.getFullYear() &&
            date.getMonth() <= minDate.getMonth());
    const disableNext = nextDisabled ||
        date >= maxDate ||
        (date.getFullYear() === maxDate.getFullYear() &&
            date.getMonth() >= maxDate.getMonth());
    return (jsxs(Box, Object.assign({ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }, { children: [jsx(Box, { children: jsx(IconButton, Object.assign({ disabled: disablePrev, onClick: onClickPrevious }, { children: jsx(ChevronLeft, { color: disablePrev ? 'disabled' : 'action' }) })) }), jsx(Box, { children: jsx(StyledSelect, Object.assign({ size: 'small', variant: 'standard', value: getMonth(date), onChange: handleMonthChange, IconComponent: ExpandMoreIcon }, { children: MONTHS.map((month, idx) => (jsx(MenuItem, Object.assign({ value: idx }, { children: month }), month))) })) }), jsx(Box, { children: jsx(StyledSelect, Object.assign({ size: 'small', variant: 'standard', value: getYear(date), onChange: handleYearChange, MenuProps: { disablePortal: true }, IconComponent: ExpandMoreIcon }, { children: generateYears(theDate, delta, count).map((year) => (jsx(MenuItem, Object.assign({ value: year }, { children: year }), year))) })) }), jsx(Box, { children: jsx(IconButton, Object.assign({ disabled: disableNext, onClick: onClickNext }, { children: jsx(ChevronRight, { color: disableNext ? 'disabled' : 'action' }) })) })] })));
}

const StyledDayBox = styled(Box)(({ theme, filled, outlined, disabled, highlighted, startOfRange, endOfRange, }) => {
    const bg = !disabled && filled
        ? theme.palette.primary.dark
        : !disabled && highlighted
            ? theme.palette.primary.light
            : 'inherit';
    const color = bg !== 'inherit' ? theme.palette.getContrastText(bg) : '';
    return {
        display: 'flex',
        marginBottom: 2,
        borderTopLeftRadius: startOfRange ? '50%' : 0,
        borderBottomLeftRadius: startOfRange ? '50%' : 0,
        borderTopRightRadius: endOfRange ? '50%' : 0,
        borderBottomRightRadius: endOfRange ? '50%' : 0,
        backgroundColor: !disabled && highlighted ? theme.palette.primary.light : 'inherit',
        '& .MuiIconButton-root': {
            height: 36,
            width: 36,
            padding: 0,
            border: !disabled && outlined
                ? `1px solid ${theme.palette.primary.dark}`
                : 'inherit',
            backgroundColor: bg,
            //backgroundColor: !disabled && filled ? theme.palette.primary.dark : '',
            '& .MuiTypography-root': {
                color: color,
                /*color:
                  !disabled && (filled || highlighted)
                    ? theme.palette.getContrastText(theme.palette.primary.dark)
                    : '',*/
            },
        },
    };
});
function Day(props) {
    const { onHover, onClick } = props, others = __rest(props, ["onHover", "onClick"]);
    return (jsx(StyledDayBox, Object.assign({}, others, { className: props.highlighted ? 'selected' : '' }, { children: jsx(IconButton, Object.assign({ disabled: props.disabled, onClick: onClick, onMouseOver: onHover, className: `btn-day-${props.value}` }, { children: jsx(Typography, Object.assign({ color: !props.disabled ? 'initial' : 'textSecondary', variant: 'body2' }, { children: props.value })) })) })));
}

const WEEK_DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const NOOP = () => { };
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
function Month(props) {
    const { helpers, handlers, value: date, dateRange, marker, setValue: setDate, minDate, maxDate, } = props;
    const [back, forward] = props.navState;
    return (jsx(StyledBox, Object.assign({ className: `month-${marker}` }, { children: jsxs(Box, { children: [jsx(Header, { dateRange: dateRange, minDate: minDate, maxDate: maxDate, marker: marker, date: date, setDate: setDate, nextDisabled: !forward, prevDisabled: !back, onClickPrevious: () => handlers.onMonthNavigate(marker, NavigationAction.Previous), onClickNext: () => handlers.onMonthNavigate(marker, NavigationAction.Next) }), jsx(Box, Object.assign({ className: 'weekDaysContainer' }, { children: WEEK_DAYS.map((day) => (jsx(Typography, Object.assign({ color: 'textSecondary', variant: 'caption' }, { children: day }), day))) })), jsx(Box, Object.assign({ className: 'daysContainer' }, { children: chunks(getDaysInMonth(date), 7).map((week, idx) => (jsx(Box, Object.assign({ className: 'daysRow' }, { children: week.map((day) => {
                            const isStart = isStartOfRange(dateRange, day);
                            const isEnd = isEndOfRange(dateRange, day);
                            const isRangeOneDay = isRangeSameDay(dateRange);
                            const highlighted = inDateRange(dateRange, day) || helpers.inHoverRange(day);
                            const disabled = !isSameMonth(date, day) ||
                                !isWithinInterval(day, {
                                    start: minDate,
                                    end: maxDate,
                                });
                            return (jsx(Day, { filled: isStart || isEnd, outlined: isToday(day), highlighted: highlighted && !isRangeOneDay, disabled: disabled, startOfRange: isStart && !isRangeOneDay, endOfRange: isEnd && !isRangeOneDay, onClick: disabled ? NOOP : () => handlers.onDayClick(day), onHover: disabled ? NOOP : () => handlers.onDayHover(day), value: getDate(day) }, format(day, 'mm-dd-yyyy')));
                        }) }), idx))) }))] }) })));
}

const isSameRange = (first, second) => {
    const { startDate: fStart, endDate: fEnd } = first;
    const { startDate: sStart, endDate: sEnd } = second;
    if (fStart && sStart && fEnd && sEnd) {
        return isSameDay(fStart, sStart) && isSameDay(fEnd, sEnd);
    }
    return false;
};
function DefinedRanges(props) {
    return (jsx(List, { children: props.ranges.map((range, idx) => (jsx(ListItem, Object.assign({ button: true, onClick: () => props.setRange(range) }, { children: jsx(ListItemText, Object.assign({ primaryTypographyProps: {
                    variant: 'body2',
                    style: {
                        fontWeight: isSameRange(range, props.selectedRange)
                            ? 'bold'
                            : 'normal',
                    },
                } }, { children: range.label })) }), idx))) }));
}

function Menu(props) {
    const { format: format$1, ranges, dateRange, minDate, maxDate, firstMonth, setFirstMonth, secondMonth, setSecondMonth, setDateRange, helpers, handlers, } = props;
    const { startDate, endDate } = dateRange;
    const canNavigateCloser = differenceInCalendarMonths(secondMonth, firstMonth) >= 2;
    const commonProps = { dateRange, minDate, maxDate, helpers, handlers };
    return (jsxs(Box, Object.assign({ sx: { p: 1 } }, { children: [jsxs(Box, Object.assign({ display: 'flex', justifyContent: 'center', alignItems: 'center' }, { children: [jsx(Box, { children: jsx(Typography, Object.assign({ variant: 'subtitle1' }, { children: startDate ? format(startDate, format$1) : 'Start Date' })) }), jsx(Box, Object.assign({ pl: 1, pr: 1, display: 'flex' }, { children: jsx(ArrowRightAlt, { color: 'action' }) })), jsx(Box, { children: jsx(Typography, Object.assign({ variant: 'subtitle1' }, { children: endDate ? format(endDate, format$1) : 'End Date' })) })] })), jsx(Divider, { sx: { mt: 1, mb: 1 } }), jsxs(Box, Object.assign({ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', sx: { overflowX: 'auto', width: '100%' } }, { children: [jsx(Box, Object.assign({ flex: 1 }, { children: jsxs(Box, Object.assign({ display: 'flex', flexWrap: 'nowrap', overflow: 'auto' }, { children: [jsx(Month, Object.assign({}, commonProps, { value: firstMonth, setValue: setFirstMonth, navState: [true, canNavigateCloser], marker: MARKERS.FIRST_MONTH })), jsx(Divider, { orientation: 'vertical', flexItem: true }), jsx(Month, Object.assign({}, commonProps, { value: secondMonth, setValue: setSecondMonth, navState: [canNavigateCloser, true], marker: MARKERS.SECOND_MONTH }))] })) })), ranges && ranges.length > 0 && (jsxs(Fragment, { children: [jsx(Divider, { orientation: 'vertical', flexItem: true }), jsx(Box, Object.assign({ minWidth: 120 }, { children: jsx(DefinedRanges, { selectedRange: dateRange, ranges: ranges, setRange: setDateRange }) }))] }))] }))] })));
}

const getDefaultRanges = (date) => [
    {
        label: "Today",
        startDate: date,
        endDate: date
    },
    {
        label: "Yesterday",
        startDate: addDays(date, -1),
        endDate: addDays(date, -1)
    },
    {
        label: "This Week",
        startDate: startOfWeek(date),
        endDate: endOfWeek(date)
    },
    {
        label: "Last Week",
        startDate: startOfWeek(addWeeks(date, -1)),
        endDate: endOfWeek(addWeeks(date, -1))
    },
    {
        label: "Last 7 Days",
        startDate: addWeeks(date, -1),
        endDate: date
    },
    {
        label: "This Month",
        startDate: startOfMonth(date),
        endDate: endOfMonth(date)
    },
    {
        label: "Last Month",
        startDate: startOfMonth(addMonths(date, -1)),
        endDate: endOfMonth(addMonths(date, -1))
    }
];
const defaultRanges = getDefaultRanges(new Date());

const getValidatedMonths = (range, minDate, maxDate) => {
    let { startDate, endDate } = range;
    if (startDate && endDate) {
        const newStart = max([startDate, minDate]);
        const newEnd = min([endDate, maxDate]);
        return [
            newStart,
            isSameMonth(newStart, newEnd) ? addMonths(newStart, 1) : newEnd,
        ];
    }
    else {
        return [startDate, endDate];
    }
};
function StaticDateRangePicker(props) {
    const today = new Date();
    const { onChange, onSelected, dateRange, minDate, maxDate, definedRanges = defaultRanges, format = defaultFormat, } = props;
    const minDateValid = parseOptionalDate(minDate, addYears(today, -150));
    const maxDateValid = parseOptionalDate(maxDate, addYears(today, 150));
    const [intialFirstMonth, initialSecondMonth] = getValidatedMonths(dateRange || {}, minDateValid, maxDateValid);
    const [intDateRange, setIntDateRange] = useState({});
    const [hoverDay, setHoverDay] = useState();
    const [firstMonth, setFirstMonth] = useState(intialFirstMonth || today);
    const [secondMonth, setSecondMonth] = useState(initialSecondMonth || addMonths(firstMonth, 1));
    const { startDate, endDate } = intDateRange;
    useEffect(() => {
        setIntDateRange(dateRange);
    }, [dateRange]);
    useEffect(() => {
        if (onSelected)
            onSelected(intDateRange);
    }, [intDateRange]);
    // handlers
    const setFirstMonthValidated = (date) => {
        if (isBefore(date, secondMonth)) {
            setFirstMonth(date);
        }
    };
    const setSecondMonthValidated = (date) => {
        if (isAfter(date, firstMonth)) {
            setSecondMonth(date);
        }
    };
    const setDateRangeValidated = (range) => {
        let { startDate: newStart, endDate: newEnd } = range;
        if (newStart && newEnd) {
            range.startDate = newStart = max([newStart, minDateValid]);
            range.endDate = newEnd = min([newEnd, maxDateValid]);
            setIntDateRange(range);
            onChange(range);
            setFirstMonth(newStart);
            setSecondMonth(isSameMonth(newStart, newEnd) ? addMonths(newStart, 1) : newEnd);
        }
    };
    const onDayClick = (day) => {
        if (startDate && !endDate && !isBefore(day, startDate)) {
            const newRange = { startDate, endDate: day };
            onChange(newRange);
            setIntDateRange(newRange);
        }
        else {
            setIntDateRange({ startDate: day, endDate: undefined });
        }
        setHoverDay(day);
    };
    const onMonthNavigate = (marker, action) => {
        if (marker == MARKERS.FIRST_MONTH) {
            const firstNew = addMonths(firstMonth, action);
            if (isBefore(firstNew, secondMonth))
                setFirstMonth(firstNew);
        }
        else {
            const secondNew = addMonths(secondMonth, action);
            if (isBefore(firstMonth, secondNew))
                setSecondMonth(secondNew);
        }
    };
    const onDayHover = (date) => {
        if (startDate && !endDate) {
            if (!hoverDay || !isSameDay(date, hoverDay)) {
                setHoverDay(date);
            }
        }
    };
    // helpers
    const inHoverRange = (day) => {
        return (startDate &&
            !endDate &&
            hoverDay &&
            isAfter(hoverDay, startDate) &&
            isWithinInterval(day, {
                start: startDate,
                end: hoverDay,
            }));
    };
    const helpers = {
        inHoverRange,
    };
    const handlers = {
        onDayClick,
        onDayHover,
        onMonthNavigate,
    };
    return (jsx(Menu, { format: format, dateRange: intDateRange, minDate: minDateValid, maxDate: maxDateValid, ranges: definedRanges, firstMonth: firstMonth, secondMonth: secondMonth, setFirstMonth: setFirstMonthValidated, setSecondMonth: setSecondMonthValidated, setDateRange: setDateRangeValidated, helpers: helpers, handlers: handlers }));
}

const StyledPickerField = styled(Box)(({ theme }) => ({
    '& > .MuiBox-root': {
        display: 'flex',
        borderRadius: theme.spacing(0.5),
        backgroundColor: theme.palette.grey[200],
        padding: theme.spacing(0, 1),
        alignItems: 'center',
    },
}));
function DateRangePickerField({ format: format$1 = defaultFormat, label, okLabel = 'Ok', cancelLabel = 'Cancel', minDate, maxDate, dateRange, definedRanges, onChange, onSelected, }) {
    const [intDateRange, setIntDateRange] = useState({});
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
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
        setIntDateRange(dateRange);
    }, [dateRange]);
    return (jsxs(StyledPickerField, Object.assign({ className: 'Mui-DateRangePickerField-root' }, { children: [jsxs(Box, { children: [jsxs(Box, Object.assign({ flex: 1 }, { children: [jsx(Typography, Object.assign({ fontSize: 12 }, { children: label })), jsxs(Typography, Object.assign({ fontSize: 14 }, { children: [dateRange && dateRange.startDate
                                        ? `${format(dateRange.startDate, format$1)}`
                                        : 'Start Date', ' - ', dateRange && dateRange.endDate
                                        ? `${format(dateRange.endDate, format$1)}`
                                        : 'End Date'] }))] })), jsx(Box, { children: jsx(IconButton, Object.assign({ onClick: handleClick }, { children: jsx(DateRangeIcon, {}) })) })] }), jsx(Popover, Object.assign({ className: 'wnd-popover', open: open, anchorEl: anchorEl, onClose: handleClose, anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'left',
                } }, { children: jsxs(Paper, Object.assign({ sx: { p: 1 } }, { children: [jsx(StaticDateRangePicker, { dateRange: intDateRange, onChange: setIntDateRange, onSelected: onSelected, minDate: minDate, maxDate: maxDate, definedRanges: definedRanges }), jsx(Divider$1, {}), jsxs(Box, Object.assign({ sx: {
                                p: 1,
                                gridGap: 8,
                                display: 'flex',
                                justifyContent: 'space-between',
                            } }, { children: [jsx(Button, Object.assign({ onClick: handleClose }, { children: cancelLabel })), jsx(Button, Object.assign({ variant: 'contained', onClick: acceptRange }, { children: okLabel }))] }))] })) }))] })));
}

export { DateRangePickerField, StaticDateRangePicker };
//# sourceMappingURL=index.esm.js.map
