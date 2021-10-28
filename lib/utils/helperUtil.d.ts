export declare const EMPTY_GUID = "00000000-0000-0000-0000-000000000000";
export declare function groupBy<T, K extends keyof any>(list: T[], getKey: (item: T) => K): Record<K, T[]>;
export declare function toDate(strDate: string): Date | null;
export declare function toFormattedDate(strDate: string): string | null;
