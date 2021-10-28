import { format, parse } from 'date-fns';

export const EMPTY_GUID = '00000000-0000-0000-0000-000000000000';

export function groupBy<T, K extends keyof any>(list: T[], getKey: (item: T) => K) {
    return list.reduce((previous, currentItem) => {
        const group = getKey(currentItem);
        if (!previous[group]) previous[group] = [];
        previous[group].push(currentItem);
        return previous;
    }, {} as Record<K, T[]>);
}

export function toDate(strDate: string) {

    try {
        return parse(strDate.substr(0, 10), 'yyyy-MM-dd', new Date());
    } catch {
        return null;
    }
}

export function toFormattedDate(strDate: string) {
    try {
        const dt = toDate(strDate);
        return dt ? format(dt, 'dd MMM yyyy') : '';
    } catch {
        return null;
    }
}