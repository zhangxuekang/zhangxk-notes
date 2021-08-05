- [使用类型声明而不是类型断言](#使用类型声明而不是类型断言)
- [在箭头函数中如何使用类型声明](#在箭头函数中如何使用类型声明)
- [什么时候用类型断言](#什么时候用类型断言)

## 使用类型声明而不是类型断言

TypeScript 有两种方式可以给一个变量指定一种类型：类型声明和类型断言

```ts
interface Person {
  name: string;
}

const alice: Person = { name: "Alice" }; // Type is Person
const bob = { name: "Bob" } as Person; // Type is Person”
```

看起来这两种方式都能达到想要的效果，但是它们是一样的吗？

类型声明代表，某个变量被声明成了某种类型，变量的行为就应该和这种类型保持一致。类型断言表示，相比较 TypeScript 自己的类型推测，你知道的更多，你直接强制“断言”该变量就是某个类型。例子：

```ts
const alice: Person = {};
// ~~~~~ Property 'name' is missing in type '{}'
//       but required in type 'Person'
const bob = {} as Person; // No error”
```

类型声明会检查变量的值是否真的与类型匹配，如果不匹配会报错；在这种情况下，类型断言就宽容的多，它并不会报错。

```ts
const alice: Person = {
  name: "Alice",
  occupation: "TypeScript developer",
  // ~~~~~~~~~ Object literal may only specify known properties
  //           and 'occupation' does not exist in type 'Person'
};
const bob = {
  name: "Bob",
  occupation: "JavaScript developer",
} as Person; // No error
```

因为类型声明相比类型断言会提供更多的类型检查，所以你应该尽可能用类型声明而不用类型断言。

## 在箭头函数中如何使用类型声明

例子：

```ts
const people = ["alice", "bob", "jan"].map((name) => ({ name }));
// { name: string; }[]... but we want Person[]”
```

在上边这个例子里，`people` 最终的类型会是 `{ name: string; }[]`，但是我们想要的是 `Person[]`。

我们可以这样做：

```ts
const people = ["alice", "bob", "jan"].map((name) => {
  const person: Person = { name };
  return person;
}); // Type is Person[]”

// 如果不想加额外的变量，可以这样
const people = ["alice", "bob", "jan"].map((name): Person => ({ name })); // Type is Person[]

// 也可以在声明变量的时候就加上类型声明。
// 如果箭头函数是一个比较复杂的函数，或者由多个函数串行起来的情况，声明的时候加上类型声明可以提前获得函数中返回值的类型错误。
const people: Person[] = ["alice", "bob", "jan"].map(
  (name): Person => ({ name })
);
```

## 什么时候用类型断言

“当你确实比 TypeScript 的类型检查知道的更多的时候”

一个典型的例子就是 DOM 元素的情况：

```ts
document.querySelector("#myButton").addEventListener("click", (e) => {
  e.currentTarget; // Type is EventTarget
  const button = e.currentTarget as HTMLButtonElement; // 你知道这个元素是一个 button，但是 JavaScript 不知道。因为 JavaScript 不会去检查页面上的 DOM。
  button; // Type is HTMLButtonElement
});
```

当你确定，一个值绝对不是 null 的时候用：

```ts
const elNull = document.getElementById("foo"); // Type is HTMLElement | null
const el = document.getElementById("foo")!; // Type is HTMLElement
```

`!` 作为前操作符使用时，是布尔值取反，当它作为后操作符使用时，表示断言该值是非 `null` 的值。

类型断言有自己的局限性，你不能断言一个明显是错误的类型。

```ts
interface Person {
  name: string;
}
const body = document.body;
const el = body as Person;
// ~~~~~~~~~~~~~~ Conversion of type 'HTMLElement' to type 'Person'
//                may be a mistake because neither type sufficiently
//                overlaps with the other. If this was intentional,
//                convert the expression to 'unknown' first
```

错误提示告诉你，两个类型没有半毛钱关系，不能断言，它还告诉你，如果你真的真的这么想这么做，那么就先断言它是 `unknown` 吧。

```ts
const el = document.body as unknown as Person; // OK
```

- 如果一种类型是另一种类型的子类，那么这两种类型就能相互断言，否则就会断言失败。
- 任何类型都是 'unknown' 的子类型。
