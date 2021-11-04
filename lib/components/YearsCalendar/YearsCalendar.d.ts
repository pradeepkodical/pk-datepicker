import { Property } from 'csstype';
import React from 'react';
import { IColorsConfig } from '../ColorsConfig';
interface IYearsCalendarConfig extends IColorsConfig {
    cellSize?: number;
}
export declare type YearCalendarData = {
    date: Date;
    bgColor: Property.Color;
};
export declare type YearsCalendarProps = {
    items: Array<YearCalendarData>;
    config?: IYearsCalendarConfig;
    onClick?: (data: YearCalendarData | null) => void;
    onHover?: (data: YearCalendarData | null) => void;
    tooltip?: React.FC<{
        item?: YearCalendarData;
    }>;
};
export declare function YearsCalendar(props: YearsCalendarProps): JSX.Element;
export {};
