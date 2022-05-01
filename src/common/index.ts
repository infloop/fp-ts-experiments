export const tuple = <T, U extends [T, ...T[]]>(tuple: U): U => tuple;
