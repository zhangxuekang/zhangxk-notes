- [什么时候使用 `readonly`](#什么时候使用-readonly)
- [使用 `readonly` 后的影响](#使用-readonly-后的影响)
- [`readonly` is shallow](#readonly-is-shallow)
- [`readonly` VS `const`](#readonly-vs-const)

## 什么时候使用 `readonly`

如果你想打印一个数列 (1, 1+2, 1+2+3, etc.)，你可能会这么写代码：

```js
function printTriangles(n: number) {
  const nums = [];
  for (let i = 0; i < n; i++) {
    nums.push(i);
    console.log(arraySum(nums));
  }
}
```

结果打印出了：

```shell
0
1
2
3
4
```

问题出在 `arraySum` 函数里：
（谁会写这种必然出 bug 的代码啊？😂 ）

```ts
function arraySum(arr: number[]) {
  let sum = 0,
    num;
  // 这里修改了 arr 的原始值。
  while ((num = arr.pop()) !== undefined) {
    sum += num;
  }
  return sum;
}
```

如果想保证入参的值不会被修改，可以给参数加上 `readonly` 声明：

```ts
function arraySum(arr: readonly number[]) {
  let sum = 0,
    num;
  while ((num = arr.pop()) !== undefined) {
    // ~~~ 'pop' does not exist on type 'readonly number[]'
    sum += num;
  }
  return sum;
}
```

`readonly` 是为了保证某个变量不会被意外的修改。嗯···**纯函数**里的使用，在业务中很难不修改某个 `VO` 的值。

## 使用 `readonly` 后的影响

不带 `readonly` 声明的类型是带 `readonly` 声明的同种类型的子类型：

```ts
const a: number[] = [1, 2, 3];
const b: readonly number[] = a;
const c: number[] = b;
// ~ Type 'readonly number[]' is 'readonly' and cannot be
//   assigned to the mutable type 'number[]'
```

如果你的函数能保证不修改入参的值，可以使用 `readonly`，函数的调用者可以放心的使用你的函数，而不用担心入参会被修改。

如果函数入参中使用了 `readonly`，再将入参传入其他函数的时候，其他函数的参数声明也必须是 `readonly`，需要注意以下情况：

```ts
function foo(a: readonly number[]) {
  bar(a);
  // Argument of type 'readonly number[]' is not assignable to parameter of type 'number'.
}

function bar(b: number) {}

foo([1, 2, 3]);
```

```ts
function foo(a: readonly number[]) {
  return a;
}

let b: number[];
b = foo([1, 2, 3]);
// The type 'readonly number[]' is 'readonly' and cannot be assigned to the mutable type 'number[]'.
```

## `readonly` is shallow

```ts
const dates: readonly Date[] = [new Date()];
dates.push(new Date());
// ~~~~ Property 'push' does not exist on type 'readonly Date[]'
dates[0].setFullYear(2037); // OK
```

```ts
interface Outer {
  inner: {
    x: number;
  };
}
const o: Readonly<Outer> = { inner: { x: 0 } };
o.inner = { x: 1 };
// ~~~~ Cannot assign to 'inner' because it is a read-only property
o.inner.x = 1; // OK

type T = Readonly<Outer>;
// Type T = {
//   readonly inner: {
//     x: number;
//   };
// }
```

## `readonly` VS `const`

```ts
const Arr = [1, 2, 3];
Arr[0] = 10; //OK
Arr.push(12); // OK
Arr.pop(); //Ok
//But
Arr = [4, 5, 6]; // ERROR

let arr1: Readonly<number> = [10, 11, 12];
arr1.pop(); //ERROR
arr1.push(15); //ERROR
arr1[0] = 1; //ERROR
// But
arr1 = [1, 2, 3];
```

```ts
let obj1: { readonly [k: string]: number } = {};
obj1.hi = 45; // ndex signature in type '{ readonly [k: string]: number; }' only permits reading.
obj1 = { ...obj1, hi: 12 }; // OK

const obj2: { [k: string]: number } = {};
obj2.hi = 45; // OK
obj2 = { ...obj2, hi: 12 }; // Cannot assign to 'obj2' because it is a constant.
```
