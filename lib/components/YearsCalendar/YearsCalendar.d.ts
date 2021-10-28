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
interface IHaveDate {
    date: Date;
    bgColor: string;
}
export declare type YearsCalendarProps = {
    items: Array<IHaveDate>;
    config?: ColorConfig;
    onClick?: (data: IHaveDate) => void;
    onHover?: (data: IHaveDate, x: number, y: number) => void;
};
export declare function YearsCalendar(props: YearsCalendarProps): JSX.Element;
export {};
