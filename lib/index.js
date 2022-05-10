'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var dateFns = require('date-fns');
var Box = require('@mui/material/Box');
var Divider = require('@mui/material/Divider');
var Typography = require('@mui/material/Typography');
var ArrowRightAlt = require('@mui/icons-material/ArrowRightAlt');
var IconButton = require('@mui/material/IconButton');
var MenuItem = require('@mui/material/MenuItem');
var Select = require('@mui/material/Select');
var ChevronLeft = require('@mui/icons-material/ChevronLeft');
var ChevronRight = require('@mui/icons-material/ChevronRight');
var ExpandMoreIcon = require('@mui/icons-material/ExpandMore');
var material = require('@mui/material');
var tslib = require('tslib');
var List = require('@mui/material/List');
var ListItem = require('@mui/material/ListItem');
var ListItemText = require('@mui/material/ListItemText');
var react = require('react');
var Button = require('@mui/material/Button');
var Paper = require('@mui/material/Paper');
var Popover = require('@mui/material/Popover');
var DateRangeIcon = require('@mui/icons-material/DateRange');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var Box__default = /*#__PURE__*/_interopDefaultLegacy(Box);
var Divider__default = /*#__PURE__*/_interopDefaultLegacy(Divider);
var Typography__default = /*#__PURE__*/_interopDefaultLegacy(Typography);
var ArrowRightAlt__default = /*#__PURE__*/_interopDefaultLegacy(ArrowRightAlt);
var IconButton__default = /*#__PURE__*/_interopDefaultLegacy(IconButton);
var MenuItem__default = /*#__PURE__*/_interopDefaultLegacy(MenuItem);
var Select__default = /*#__PURE__*/_interopDefaultLegacy(Select);
var ChevronLeft__default = /*#__PURE__*/_interopDefaultLegacy(ChevronLeft);
var ChevronRight__default = /*#__PURE__*/_interopDefaultLegacy(ChevronRight);
var ExpandMoreIcon__default = /*#__PURE__*/_interopDefaultLegacy(ExpandMoreIcon);
var List__default = /*#__PURE__*/_interopDefaultLegacy(List);
var ListItem__default = /*#__PURE__*/_interopDefaultLegacy(ListItem);
var ListItemText__default = /*#__PURE__*/_interopDefaultLegacy(ListItemText);
var Button__default = /*#__PURE__*/_interopDefaultLegacy(Button);
var Paper__default = /*#__PURE__*/_interopDefaultLegacy(Paper);
var Popover__default = /*#__PURE__*/_interopDefaultLegacy(Popover);
var DateRangeIcon__default = /*#__PURE__*/_interopDefaultLegacy(DateRangeIcon);

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
    const startWeek = dateFns.startOfWeek(dateFns.startOfMonth(date));
    const endWeek = dateFns.endOfWeek(dateFns.endOfMonth(date));
    const days = [];
    for (let curr = startWeek; dateFns.isBefore(curr, endWeek);) {
        days.push(curr);
        curr = dateFns.addDays(curr, 1);
    }
    return days;
};
const isStartOfRange = ({ startDate }, day) => (startDate && dateFns.isSameDay(day, startDate));
const isEndOfRange = ({ endDate }, day) => (endDate && dateFns.isSameDay(day, endDate));
const inDateRange = ({ startDate, endDate }, day) => (startDate &&
    endDate &&
    (dateFns.isWithinInterval(day, {
        start: startDate,
        end: endDate
    }) ||
        dateFns.isSameDay(day, startDate) ||
        dateFns.isSameDay(day, endDate)));
const isRangeSameDay = ({ startDate, endDate }) => {
    if (startDate && endDate) {
        return dateFns.isSameDay(startDate, endDate);
    }
    return false;
};
const parseOptionalDate = (date, defaultValue) => {
    if (date instanceof Date) {
        const parsed = dateFns.toDate(date);
        if (dateFns.isValid(parsed))
            return parsed;
    }
    if (date instanceof String) {
        const parsed = dateFns.parseISO(date);
        if (dateFns.isValid(parsed))
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
const StyledSelect = material.styled(Select__default["default"])(({ theme }) => ({
    '&::before, &::after': {
        border: '0 !important',
    },
}));
function Header({ dateRange, minDate, maxDate, marker, date, setDate, nextDisabled, prevDisabled, onClickNext, onClickPrevious, }) {
    var _a;
    const handleMonthChange = (event) => {
        setDate(dateFns.setMonth(date, parseInt(event.target.value)));
    };
    const handleYearChange = (event) => {
        setDate(dateFns.setYear(date, parseInt(event.target.value)));
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
    return (jsxRuntime.jsxs(Box__default["default"], Object.assign({ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }, { children: [jsxRuntime.jsx(Box__default["default"], { children: jsxRuntime.jsx(IconButton__default["default"], Object.assign({ disabled: disablePrev, onClick: onClickPrevious }, { children: jsxRuntime.jsx(ChevronLeft__default["default"], { color: disablePrev ? 'disabled' : 'action' }) })) }), jsxRuntime.jsx(Box__default["default"], { children: jsxRuntime.jsx(StyledSelect, Object.assign({ size: 'small', variant: 'standard', value: dateFns.getMonth(date), onChange: handleMonthChange, IconComponent: ExpandMoreIcon__default["default"] }, { children: MONTHS.map((month, idx) => (jsxRuntime.jsx(MenuItem__default["default"], Object.assign({ value: idx }, { children: month }), month))) })) }), jsxRuntime.jsx(Box__default["default"], { children: jsxRuntime.jsx(StyledSelect, Object.assign({ size: 'small', variant: 'standard', value: dateFns.getYear(date), onChange: handleYearChange, MenuProps: { disablePortal: true }, IconComponent: ExpandMoreIcon__default["default"] }, { children: generateYears(theDate, delta, count).map((year) => (jsxRuntime.jsx(MenuItem__default["default"], Object.assign({ value: year }, { children: year }), year))) })) }), jsxRuntime.jsx(Box__default["default"], { children: jsxRuntime.jsx(IconButton__default["default"], Object.assign({ disabled: disableNext, onClick: onClickNext }, { children: jsxRuntime.jsx(ChevronRight__default["default"], { color: disableNext ? 'disabled' : 'action' }) })) })] })));
}

const StyledDayBox = material.styled(Box__default["default"])(({ theme, filled, outlined, disabled, highlighted, startOfRange, endOfRange, }) => {
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
    const { onHover, onClick } = props, others = tslib.__rest(props, ["onHover", "onClick"]);
    return (jsxRuntime.jsx(StyledDayBox, Object.assign({}, others, { className: props.highlighted ? 'selected' : '' }, { children: jsxRuntime.jsx(IconButton__default["default"], Object.assign({ disabled: props.disabled, onClick: onClick, onMouseOver: onHover, className: `btn-day-${props.value}` }, { children: jsxRuntime.jsx(Typography__default["default"], Object.assign({ color: !props.disabled ? 'initial' : 'textSecondary', variant: 'body2' }, { children: props.value })) })) })));
}

const WEEK_DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const NOOP = () => { };
const StyledBox = material.styled(Box__default["default"])(({ theme }) => ({
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
    return (jsxRuntime.jsx(StyledBox, Object.assign({ className: `month-${marker}` }, { children: jsxRuntime.jsxs(Box__default["default"], { children: [jsxRuntime.jsx(Header, { dateRange: dateRange, minDate: minDate, maxDate: maxDate, marker: marker, date: date, setDate: setDate, nextDisabled: !forward, prevDisabled: !back, onClickPrevious: () => handlers.onMonthNavigate(marker, NavigationAction.Previous), onClickNext: () => handlers.onMonthNavigate(marker, NavigationAction.Next) }), jsxRuntime.jsx(Box__default["default"], Object.assign({ className: 'weekDaysContainer' }, { children: WEEK_DAYS.map((day) => (jsxRuntime.jsx(Typography__default["default"], Object.assign({ color: 'textSecondary', variant: 'caption' }, { children: day }), day))) })), jsxRuntime.jsx(Box__default["default"], Object.assign({ className: 'daysContainer' }, { children: chunks(getDaysInMonth(date), 7).map((week, idx) => (jsxRuntime.jsx(Box__default["default"], Object.assign({ className: 'daysRow' }, { children: week.map((day) => {
                            const isStart = isStartOfRange(dateRange, day);
                            const isEnd = isEndOfRange(dateRange, day);
                            const isRangeOneDay = isRangeSameDay(dateRange);
                            const highlighted = inDateRange(dateRange, day) || helpers.inHoverRange(day);
                            const disabled = !dateFns.isSameMonth(date, day) ||
                                !dateFns.isWithinInterval(day, {
                                    start: minDate,
                                    end: maxDate,
                                });
                            return (jsxRuntime.jsx(Day, { filled: isStart || isEnd, outlined: dateFns.isToday(day), highlighted: highlighted && !isRangeOneDay, disabled: disabled, startOfRange: isStart && !isRangeOneDay, endOfRange: isEnd && !isRangeOneDay, onClick: disabled ? NOOP : () => handlers.onDayClick(day), onHover: disabled ? NOOP : () => handlers.onDayHover(day), value: dateFns.getDate(day) }, dateFns.format(day, 'mm-dd-yyyy')));
                        }) }), idx))) }))] }) })));
}

const isSameRange = (first, second) => {
    const { startDate: fStart, endDate: fEnd } = first;
    const { startDate: sStart, endDate: sEnd } = second;
    if (fStart && sStart && fEnd && sEnd) {
        return dateFns.isSameDay(fStart, sStart) && dateFns.isSameDay(fEnd, sEnd);
    }
    return false;
};
function DefinedRanges(props) {
    return (jsxRuntime.jsx(List__default["default"], { children: props.ranges.map((range, idx) => (jsxRuntime.jsx(ListItem__default["default"], Object.assign({ button: true, onClick: () => props.setRange(range) }, { children: jsxRuntime.jsx(ListItemText__default["default"], Object.assign({ primaryTypographyProps: {
                    variant: 'body2',
                    style: {
                        fontWeight: isSameRange(range, props.selectedRange)
                            ? 'bold'
                            : 'normal',
                    },
                } }, { children: range.label })) }), idx))) }));
}

function Menu(props) {
    const { format, ranges, dateRange, minDate, maxDate, firstMonth, setFirstMonth, secondMonth, setSecondMonth, setDateRange, helpers, handlers, } = props;
    const { startDate, endDate } = dateRange;
    const canNavigateCloser = dateFns.differenceInCalendarMonths(secondMonth, firstMonth) >= 2;
    const commonProps = { dateRange, minDate, maxDate, helpers, handlers };
    return (jsxRuntime.jsxs(Box__default["default"], Object.assign({ sx: { p: 1 } }, { children: [jsxRuntime.jsxs(Box__default["default"], Object.assign({ display: 'flex', justifyContent: 'center', alignItems: 'center' }, { children: [jsxRuntime.jsx(Box__default["default"], { children: jsxRuntime.jsx(Typography__default["default"], Object.assign({ variant: 'subtitle1' }, { children: startDate ? dateFns.format(startDate, format) : 'Start Date' })) }), jsxRuntime.jsx(Box__default["default"], Object.assign({ pl: 1, pr: 1, display: 'flex' }, { children: jsxRuntime.jsx(ArrowRightAlt__default["default"], { color: 'action' }) })), jsxRuntime.jsx(Box__default["default"], { children: jsxRuntime.jsx(Typography__default["default"], Object.assign({ variant: 'subtitle1' }, { children: endDate ? dateFns.format(endDate, format) : 'End Date' })) })] })), jsxRuntime.jsx(Divider__default["default"], { sx: { mt: 1, mb: 1 } }), jsxRuntime.jsxs(Box__default["default"], Object.assign({ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', sx: { overflowX: 'auto', width: '100%' } }, { children: [jsxRuntime.jsx(Box__default["default"], Object.assign({ flex: 1 }, { children: jsxRuntime.jsxs(Box__default["default"], Object.assign({ display: 'flex', flexWrap: 'nowrap', overflow: 'auto' }, { children: [jsxRuntime.jsx(Month, Object.assign({}, commonProps, { value: firstMonth, setValue: setFirstMonth, navState: [true, canNavigateCloser], marker: MARKERS.FIRST_MONTH })), jsxRuntime.jsx(Divider__default["default"], { orientation: 'vertical', flexItem: true }), jsxRuntime.jsx(Month, Object.assign({}, commonProps, { value: secondMonth, setValue: setSecondMonth, navState: [canNavigateCloser, true], marker: MARKERS.SECOND_MONTH }))] })) })), ranges && ranges.length > 0 && (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsx(Divider__default["default"], { orientation: 'vertical', flexItem: true }), jsxRuntime.jsx(Box__default["default"], Object.assign({ minWidth: 120 }, { children: jsxRuntime.jsx(DefinedRanges, { selectedRange: dateRange, ranges: ranges, setRange: setDateRange }) }))] }))] }))] })));
}

const getDefaultRanges = (date) => [
    {
        label: "Today",
        startDate: date,
        endDate: date
    },
    {
        label: "Yesterday",
        startDate: dateFns.addDays(date, -1),
        endDate: dateFns.addDays(date, -1)
    },
    {
        label: "This Week",
        startDate: dateFns.startOfWeek(date),
        endDate: dateFns.endOfWeek(date)
    },
    {
        label: "Last Week",
        startDate: dateFns.startOfWeek(dateFns.addWeeks(date, -1)),
        endDate: dateFns.endOfWeek(dateFns.addWeeks(date, -1))
    },
    {
        label: "Last 7 Days",
        startDate: dateFns.addWeeks(date, -1),
        endDate: date
    },
    {
        label: "This Month",
        startDate: dateFns.startOfMonth(date),
        endDate: dateFns.endOfMonth(date)
    },
    {
        label: "Last Month",
        startDate: dateFns.startOfMonth(dateFns.addMonths(date, -1)),
        endDate: dateFns.endOfMonth(dateFns.addMonths(date, -1))
    }
];
const defaultRanges = getDefaultRanges(new Date());

const getValidatedMonths = (range, minDate, maxDate) => {
    let { startDate, endDate } = range;
    if (startDate && endDate) {
        const newStart = dateFns.max([startDate, minDate]);
        const newEnd = dateFns.min([endDate, maxDate]);
        return [
            newStart,
            dateFns.isSameMonth(newStart, newEnd) ? dateFns.addMonths(newStart, 1) : newEnd,
        ];
    }
    else {
        return [startDate, endDate];
    }
};
function StaticDateRangePicker(props) {
    const today = new Date();
    const { onChange, onSelected, dateRange, minDate, maxDate, definedRanges = defaultRanges, format = defaultFormat, } = props;
    const minDateValid = parseOptionalDate(minDate, dateFns.addYears(today, -150));
    const maxDateValid = parseOptionalDate(maxDate, dateFns.addYears(today, 150));
    const [intialFirstMonth, initialSecondMonth] = getValidatedMonths(dateRange || {}, minDateValid, maxDateValid);
    const [intDateRange, setIntDateRange] = react.useState({});
    const [hoverDay, setHoverDay] = react.useState();
    const [firstMonth, setFirstMonth] = react.useState(intialFirstMonth || today);
    const [secondMonth, setSecondMonth] = react.useState(initialSecondMonth || dateFns.addMonths(firstMonth, 1));
    const { startDate, endDate } = intDateRange;
    react.useEffect(() => {
        setIntDateRange(dateRange);
    }, [dateRange]);
    react.useEffect(() => {
        if (onSelected)
            onSelected(intDateRange);
    }, [intDateRange]);
    // handlers
    const setFirstMonthValidated = (date) => {
        if (dateFns.isBefore(date, secondMonth)) {
            setFirstMonth(date);
        }
    };
    const setSecondMonthValidated = (date) => {
        if (dateFns.isAfter(date, firstMonth)) {
            setSecondMonth(date);
        }
    };
    const setDateRangeValidated = (range) => {
        let { startDate: newStart, endDate: newEnd } = range;
        if (newStart && newEnd) {
            range.startDate = newStart = dateFns.max([newStart, minDateValid]);
            range.endDate = newEnd = dateFns.min([newEnd, maxDateValid]);
            setIntDateRange(range);
            onChange(range);
            setFirstMonth(newStart);
            setSecondMonth(dateFns.isSameMonth(newStart, newEnd) ? dateFns.addMonths(newStart, 1) : newEnd);
        }
    };
    const onDayClick = (day) => {
        if (startDate && !endDate && !dateFns.isBefore(day, startDate)) {
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
            const firstNew = dateFns.addMonths(firstMonth, action);
            if (dateFns.isBefore(firstNew, secondMonth))
                setFirstMonth(firstNew);
        }
        else {
            const secondNew = dateFns.addMonths(secondMonth, action);
            if (dateFns.isBefore(firstMonth, secondNew))
                setSecondMonth(secondNew);
        }
    };
    const onDayHover = (date) => {
        if (startDate && !endDate) {
            if (!hoverDay || !dateFns.isSameDay(date, hoverDay)) {
                setHoverDay(date);
            }
        }
    };
    // helpers
    const inHoverRange = (day) => {
        return (startDate &&
            !endDate &&
            hoverDay &&
            dateFns.isAfter(hoverDay, startDate) &&
            dateFns.isWithinInterval(day, {
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
    return (jsxRuntime.jsx(Menu, { format: format, dateRange: intDateRange, minDate: minDateValid, maxDate: maxDateValid, ranges: definedRanges, firstMonth: firstMonth, secondMonth: secondMonth, setFirstMonth: setFirstMonthValidated, setSecondMonth: setSecondMonthValidated, setDateRange: setDateRangeValidated, helpers: helpers, handlers: handlers }));
}

const StyledPickerField = material.styled(Box__default["default"])(({ theme }) => ({
    '& > .MuiBox-root': {
        display: 'flex',
        borderRadius: theme.spacing(0.5),
        backgroundColor: theme.palette.grey[200],
        padding: theme.spacing(0, 1),
        alignItems: 'center',
    },
}));
function DateRangePickerField({ format = defaultFormat, label, okLabel = 'Ok', cancelLabel = 'Cancel', minDate, maxDate, dateRange, definedRanges, onChange, onSelected, }) {
    const [intDateRange, setIntDateRange] = react.useState({});
    const [anchorEl, setAnchorEl] = react.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = react.useCallback(() => {
        setAnchorEl(null);
    }, []);
    const acceptRange = () => {
        onChange(intDateRange);
        setAnchorEl(null);
    };
    react.useEffect(() => {
        setIntDateRange(dateRange);
    }, [dateRange]);
    return (jsxRuntime.jsxs(StyledPickerField, Object.assign({ className: 'Mui-DateRangePickerField-root' }, { children: [jsxRuntime.jsxs(Box__default["default"], { children: [jsxRuntime.jsxs(Box__default["default"], Object.assign({ flex: 1 }, { children: [jsxRuntime.jsx(Typography__default["default"], Object.assign({ fontSize: 12 }, { children: label })), jsxRuntime.jsxs(Typography__default["default"], Object.assign({ fontSize: 14 }, { children: [dateRange && dateRange.startDate
                                        ? `${dateFns.format(dateRange.startDate, format)}`
                                        : 'Start Date', ' - ', dateRange && dateRange.endDate
                                        ? `${dateFns.format(dateRange.endDate, format)}`
                                        : 'End Date'] }))] })), jsxRuntime.jsx(Box__default["default"], { children: jsxRuntime.jsx(IconButton__default["default"], Object.assign({ onClick: handleClick }, { children: jsxRuntime.jsx(DateRangeIcon__default["default"], {}) })) })] }), jsxRuntime.jsx(Popover__default["default"], Object.assign({ className: 'wnd-popover', open: open, anchorEl: anchorEl, onClose: handleClose, anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'left',
                } }, { children: jsxRuntime.jsxs(Paper__default["default"], Object.assign({ sx: { p: 1 } }, { children: [jsxRuntime.jsx(StaticDateRangePicker, { dateRange: intDateRange, onChange: setIntDateRange, onSelected: onSelected, minDate: minDate, maxDate: maxDate, definedRanges: definedRanges }), jsxRuntime.jsx(material.Divider, {}), jsxRuntime.jsxs(Box__default["default"], Object.assign({ sx: {
                                p: 1,
                                gridGap: 8,
                                display: 'flex',
                                justifyContent: 'space-between',
                            } }, { children: [jsxRuntime.jsx(Button__default["default"], Object.assign({ onClick: handleClose }, { children: cancelLabel })), jsxRuntime.jsx(Button__default["default"], Object.assign({ variant: 'contained', onClick: acceptRange }, { children: okLabel }))] }))] })) }))] })));
}

exports.DateRangePickerField = DateRangePickerField;
exports.StaticDateRangePicker = StaticDateRangePicker;
//# sourceMappingURL=index.js.map
