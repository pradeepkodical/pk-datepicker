/// <reference types="react" />
import { Property } from 'csstype';
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
    onClick?: (data: YearCalendarData) => void;
    onHover?: (data: YearCalendarData, x: number, y: number) => void;
};
export declare function YearsCalendar(props: YearsCalendarProps): JSX.Element;
export {};
