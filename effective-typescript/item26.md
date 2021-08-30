- [上下文对类型推导的影响](#上下文对类型推导的影响)
- [更多例子](#更多例子)
  - [Tuple Types](#tuple-types)
  - [Objects](#objects)
  - [Callbacks](#callbacks)
- [总结](#总结)

## 上下文对类型推导的影响

TypeScript 不止是根据变量的值进行类型推导的，上下文也对类型推导有影响。如果你不清楚上下文如何影响类型推导，可能会对推导出的类型产生疑惑。

```ts
setLanguage("JavaScript");
// 在 js 里是等价的操作
let language = "JavaScript";
setLanguage(language);

// 在 ts 里，这样做也没有什么问题
function setLanguage(language: string) {
  /* ... */
}

setLanguage("JavaScript"); // OK

let language = "JavaScript";
setLanguage(language); // OK
```

稍微对例子进行一些修改：

```js
type Language = "JavaScript" | "TypeScript" | "Python";
function setLanguage(language: Language) {
  /* ... */
}

setLanguage("JavaScript"); // OK

let language = "JavaScript";
setLanguage(language);
// ~~~~~~~~ Argument of type 'string' is not assignable
//          to parameter of type 'Language'
```

`let language = 'JavaScript';` 语句意味着，ts 推断出 `language` 是 `string` 类型的，这很合理。但是 `setLanguage` 函数想要的是 `Language` 类型，所以会出错。

要解决这个问题，有两种方法：

```ts
let language: Language = "JavaScript";
setLanguage(language); // OK

const language = "JavaScript";
setLanguage(language); // OK
```

> The fundamental issue here is that we’ve separated the value from the context in which it’s used.

## 更多例子

### Tuple Types

```ts
function panTo(where: [number, number]) {
  /* ... */
}

panTo([10, 20]); // OK

const loc = [10, 20];
panTo(loc);
//    ~~~ Argument of type 'number[]' is not assignable to
//        parameter of type '[number, number]'
```

解决：

```ts
const loc: [number, number] = [10, 20];
panTo(loc); // OK
```

但是如果想使用 `const` 会有别的问题：

```ts
const loc = [10, 20] as const;
panTo(loc);
// ~~~ Type 'readonly [10, 20]' is 'readonly'
//     and cannot be assigned to the mutable type '[number, number]'
```

为了解决以上问题，函数得声明成这样 `function panTo(where: readonly [number, number]) { /* ... */ }`。

### Objects

```ts
type Language = "JavaScript" | "TypeScript" | "Python";
interface GovernedLanguage {
  language: Language;
  organization: string;
}

function complain(language: GovernedLanguage) {
  /* ... */
}

complain({ language: "TypeScript", organization: "Microsoft" }); // OK

const ts = {
  language: "TypeScript",
  organization: "Microsoft",
};
complain(ts);
//       ~~ Argument of type '{ language: string; organization: string; }'
//            is not assignable to parameter of type 'GovernedLanguage'
//          Types of property 'language' are incompatible
//            Type 'string' is not assignable to type 'Language'
```

可以使用 `const ts: GovernedLanguage` 和 `language: 'TypeScript' as const,`解决。

### Callbacks

```ts
function callWithRandomNumbers(fn: (n1: number, n2: number) => void) {
  fn(Math.random(), Math.random());
}

// TypeScript 根据回调函数的上下文推断出参数的类型
callWithRandomNumbers((a, b) => {
  a; // Type is number
  b; // Type is number
  console.log(a + b);
});
```

如果没有回调函数上下文，ts 不能推断出参数的类型，只能说是 `any` 类型的。

```ts
const fn = (a, b) => {
  // ~    Parameter 'a' implicitly has an 'any' type
  //    ~ Parameter 'b' implicitly has an 'any' type
  console.log(a + b);
};
callWithRandomNumbers(fn);
```

## 总结

- 注意上下文对类型推断的影响
- 如果出现上下文类型推断错误，考虑在变量声明的时候显式声明类型
- 如果变量在声明后就不会再变，可以使用 `const` 声明（`as const`），给 ts 更多信息作出正确的类型推导。但是这种方法会将报错信息留到参数使用的时候暴露，如果使用上面的方法，值与类型不符的情况在变量声明的时候就会暴露出来。
