import { Property } from 'csstype';
import React from 'react';
declare type ColorConfig = {
    selBgColor?: Property.Color;
    defaultBgColor?: Property.Color;
    alternateBgColor?: Property.Color;
    textColor?: Property.Color;
    selTextColor?: Property.Color;
    borderColor?: Property.Color;
};
export declare type YearCalendarData = {
    date: Date;
    bgColor: Property.Color;
};
export declare type YearsCalendarProps = {
    items: Array<YearCalendarData>;
    config?: ColorConfig;
    onClick?: (data: YearCalendarData | null) => void;
    onHover?: (data: YearCalendarData | null) => void;
    tooltip?: React.FC<{
        item?: YearCalendarData;
    }>;
};
export declare function YearsCalendar(props: YearsCalendarProps): JSX.Element;
export {};
