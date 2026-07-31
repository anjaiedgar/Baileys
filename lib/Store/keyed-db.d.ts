export interface Comparable {
    key: (value: any) => string | number;
    compare: (k1: string | number, k2: string | number) => number;
}
export default class KeyedDB<T = any> {
    key: Comparable;
    idGetter: (value: T) => string;
    dict: { [id: string]: T };
    array: T[];
    constructor(key: Comparable, id?: (value: T) => string);
    get length(): number;
    get first(): T | undefined;
    get last(): T | undefined;
    toJSON(): T[];
    insert(...values: T[]): void;
    upsert(...values: T[]): T[];
    insertIfAbsent(...values: T[]): T[];
    deleteById(id: string, assertPresent?: boolean): T | null | undefined;
    delete(value: T): T | null;
    slice(start?: number, end?: number): KeyedDB<T>;
    clear(): void;
    get(id: string): T | undefined;
    all(): T[];
    update(id: string, update: (value: T) => void): number | undefined;
    updateKey(value: T, update: (value: T) => void): number | undefined;
    filter(predicate: (value: T, index: number) => boolean): KeyedDB<T>;
    paginatedByValue(value: T | null | undefined, limit: number, predicate?: (value: T, index: number) => boolean, mode?: 'before' | 'after'): T[];
    paginated(cursor: string | number | null | undefined, limit: number, predicate?: (value: T, index: number) => boolean, mode?: 'before' | 'after'): T[];
    firstIndex(value: T): number;
}
