# extra-generator

## Install

```sh
npm install --save extra-generator
# or
yarn add extra-generator
```

### API

#### of

```ts
function of<T>(val: T): Iterable<T>
```

```js
of(1) // [1]
```

#### countdown

```ts
function countdown(begin: number, end: number): Iterable<number>
```

```js
countdown(2, -2) // [2, 1, 0, -1, -2]
countdown(1, 1) // [1]
countdown(0, 1) // []
```

#### countup

```ts
function countup(begin: number, end: number): Iterable<number>
```

```js
countup(-2, 2) // [-2, -1, 0, 1, 2]
countup(1, 1) // [1]
countup(1, 0) // []
```

#### range

```ts
function range(start: number, end: number, step: number = 1): Iterable<number>
// assert(step > 0)
```

```js
range(1, 1) // []
range(-2, 2) // [-2, -1, 0, 1]
range(2, -2) // [2, 1, 0, -1]
range(1, -1, 0.5) // [1, 0.5, 0, -0.5]
range(2, -2, 0) // throw Error
range(2, -2, -0.5) // throw Error
```

#### stringifyJSONStream

```ts
function stringifyJSONStream(iterable: Iterable<unknown>): Iterable<string>
```

#### stringifyJSONStreamAsync

```ts
function stringifyNDJSONStreamAsync(iterable: AsyncIterable<unknown>): AsyncIterable<string>
```

#### stringifyNDJSONStream

```ts
function stringifyNDJSONStream(iterable: Iterable<unknown>): Iterable<string>
```

#### stringifyNDJSONStreamAsync

```ts
function stringifyNDJSONStreamAsync(iterable: AsyncIterable<unknown>): AsyncIterable<string>
```

#### sse

```ts
interface IMessage {
  event?: string
  data: string
  id?: string
  retry?: number
}

function sse(message: IMessage): Iterable<string>
```
