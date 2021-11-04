import { Property } from 'csstype';

export type DefaultColorOrFunc = Property.Color | (() => Array<Property.Color>);

export type StringColorOrFunc = string | (() => Array<string>);

export interface IColorsConfig {
    selBgColor?: StringColorOrFunc;
    defaultBgColor?: StringColorOrFunc;
    alternateBgColor?: StringColorOrFunc;
    textColor?: StringColorOrFunc;
    selTextColor?: StringColorOrFunc;
    borderColor?: StringColorOrFunc;

    background?: string;
    color?: string;
}

export interface ColorsConfig {
    selBgColor: DefaultColorOrFunc;
    defaultBgColor: DefaultColorOrFunc;
    alternateBgColor: DefaultColorOrFunc;
    textColor: DefaultColorOrFunc;
    selTextColor: DefaultColorOrFunc;
    borderColor: DefaultColorOrFunc;

    background: Property.Color;
    color: Property.Color;
}

export const DEFAULT_COLORS: ColorsConfig = {
    selBgColor: '#dcf5ff',
    defaultBgColor: '#fff',
    alternateBgColor: '#fefefe',
    textColor: '#000',
    selTextColor: '#111',
    borderColor: '#efefef',

    background: '#fff',
    color: '#000'
}

export function getConfig(config?: IColorsConfig) {
    return { ...DEFAULT_COLORS, ...config } as ColorsConfig;
}