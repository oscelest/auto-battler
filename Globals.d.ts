type Fn = (...args: any[]) => void
type EventFn<E extends {}> = (event: E) => void;
type StrictObject = {[key: symbol]: any}
type Constructor = new (...args: any[]) => any;
type ClassInstance = object
type Enum = {[key: string]: string | number}
