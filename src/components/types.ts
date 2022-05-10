export interface PickerDateRange {
	startDate?: Date;
	endDate?: Date;
}

export type Setter<T> = React.Dispatch<React.SetStateAction<T>> | ((value: T) => void);

export enum NavigationAction {
	Previous = -1,
	Next = 1
}

export type DefinedRange = {
	startDate: Date;
	endDate: Date;
	label: string;
};

export type Marker = string;

export const MARKERS: { [key: string]: Marker } = {
  FIRST_MONTH: 'firstMonth',
  SECOND_MONTH: 'secondMonth',
};

export const defaultFormat = 'MM/dd/yyyy'