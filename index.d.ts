/** Assert an expression is true. */
declare function assert(expression: unknown, message?: string): asserts expression;
/** Assert an expression is not null, and returns it. */
declare function assertNotNull<T>(expression: T, message?: string): NonNullable<T>;
/** Downloads an auto generated file locally. */
declare function download(filename: string, text: string, meta?: BlobPropertyBag): void;
