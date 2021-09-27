---
title: 函数式编程笔记
date: 2021
tags:
  - javascript
  - 函数式编程
header_image: https://source.unsplash.com/random
---

# 函数式编程

什么是函数式编程？

维基百科定义：

> 函数式编程\[Functional Programming\]是一种编程模型，他将计算机运算看做是数学中函数的计算，并且避免了状态以及变量的概念。

函数式编程和过程式编程有什么区别？

举个栗子，现在有一个这样的表达式：

```javascript
(1 + 2) * 3 - 4;
```

过程式编程可能是这样实现的：

```javascript
const a = 1 + 2;
const b = a * 3;
const c = b - 4;
```

使用函数式编程会将计算过程定义为不同的函数，依次调用函数：

```javascript
const result = subtract(multiply(add(1, 2), 3), 4);
```

除了调用函数，一点多余的代码都不需要写。这些函数甚至不用自己定义，各种函数库随你使用。

### 函数式编程的特点

1. 函数是"第一等公民"
   - 所谓"第一等公民"（first class），指的是函数与其他数据类型一样，处于平等地位，可以赋值给其他变量，也可以作为参数，传入另一个函数，或者作为别的函数的返回值。javascript 中的函数天生就是一等公民。
   - 举例来说 print 变量就是一个函数，可以作为另一个函数的参数

```javascript
const print = (v) => console.log(v);
[1, 2, 3].forEach(print);
```

- 理解函数是一等公民的本质，会让你删除很多无用的间接层代码。

```javascript
const getServerStuff = (callback) => ajaxCall((json) => callback(json));
// 等价于
const getServerStuff = ajaxCall;

// 逐步分析
// const fn = (json) => callback(json);
// fn('abc') -> callback('abc')
// fn -> callback
// 这行
ajaxCall((json) => callback(json));

// 等价于这行
ajaxCall(callback);

// 那么，重构下 getServerStuff
const getServerStuff = (callback) => ajaxCall(callback);

// ...就等于
const getServerStuff = ajaxCall;
```

1. 只用"表达式"，不用"语句"
   - "表达式"（expression）是一个单纯的运算过程，总是有返回值；"语句"（statement）是执行某种操作，没有返回值。
   - 函数式编程要求每一步都是单纯的运算，而且都有返回值。
   - 函数式编程的动机是进行运算。
2. 没有"副作用"
   - 所谓"副作用"（side effect），指的是函数内部与外部互动（最典型的情况，就是修改全局变量的值），产生运算以外的其他结果。
   - 函数式编程不考虑系统的读写（I/O）。
   - 函数要保持独立，不得修改外部变量的值。
3. 不修改状态
   - 强调不修改外部变量
4. 引用透明
   - 引用透明（Referential transparency），指的是函数的运行不依赖于外部变量或"状态"，只依赖于输入的参数，任何时候只要参数相同，引用函数所得到的返回值总是相同的。

#### this

值得一提的是，函数式编程不建议在函数中使用`this`关键字，因为`this`的行为依赖函数运行的实际情况。而函数式编程要求无论何时，无论是谁调用这个函数，只要输入参数一样，必然能输出相同的结果。

### 纯函数的好处

**`"纯"`** ：相同的输入，永远会得到相同的输出，而且没有任何可观察的副作用。

```javascript
var xs = [1, 2, 3, 4, 5];

// 纯的
xs.slice(0, 3);
//=> [1,2,3].
xs.slice(0, 3);
//=> [1,2,3]
xs.slice(0, 3);
//=> [1,2,3]

// 不纯的
xs.splice(0, 3);
//=> [1,2,3]
xs.splice(0, 3);
//=> [4,5]
xs.splice(0, 3);
//=> []
```

> 副作用是在计算结果的过程中，系统状态的一种变化，或者与外部世界进行的可观察的交互。

副作用可能包含，但不限于：

- 更改文件系统
- 往数据库插入记录
- 发送一个 http 请求
- 可变数据
- 打印/log
- 获取用户输入
- DOM 查询
- 访问系统状态

一个系统不可能不产生副作用而单独运行，函数式编程要让副作用在可控的范围内发生。  
\(函数式编程的部分，更像是计算机系统中的 CPU 角色，负责底层逻辑的运算\)

#### 追求“纯”的理由

- 可缓存性（Cacheable）
  - 因为纯函数对相同的输入总是产生相同的输入，所以完全可以缓存结果
  - 缓存过的纯函数，相同参数运行过一次，再次运行时，直接从缓存中读取结果，省去了计算过程

```javascript
const memoize = function (f) {
  const cache = {};
  return function () {
    var arg_str = JSON.stringify(arguments);
    cache[arg_str] = cache[arg_str] || f.apply(f, arguments);
    return cache[arg_str];
  };
};
```

- 可移植性／自文档化（Portable / Self-Documenting）
  - 纯函数是"自给自足"的， 纯函数的依赖很明确。 需要什么资源，就必须当做参数传进去。
  - 纯函数可以毫无压力的移植到不同项目中使用。

```javascript
    // 不纯的，只能在当前Db数据库中使用
    var saveUser = function(attrs) {
       var user = Db.save(attrs);
       ...
    ;
    // 纯的， 函数可移植到任何数据库使用
    var saveUser = function(attrs， Db) {
       var user = Db.save(attrs);
       ...
    ;
```

- 可测试性（Testable）
  - 因为纯函数对每次相同输入都有相同的输入，并且纯函数的不依赖运行的环境因素，所以做单元测试的时候更加容易。
- 合理性（Reasonable）

  - 引用透明

    > 如果一段代码可以替换成它执行所得的结果，而且是在不改变整个程序行为的前提下替换的，那么我们就说这段代码是引用透明的。

  - 纯函数保证了引用透明。
  - 使用纯函数编写的程序代码，更容易分模块，更容易被理解分析

- 并行代码
  - 纯函数不需要访问共享内存
  - 纯函数不会因为副作用而进入竞争态
  - 所以纯函数可以并行

### 介绍两种写纯函数的"工具"

#### 柯里化\(curry\)

只传递给函数一部分参数去调用它，让它返回一个函数去处理剩下的参数  
一个简单的例子：

```javascript
const add = function (x) {
  return function (y) {
    return x + y;
  };
};

const increment = add(1);
const addTen = add(10);

increment(2); // 3

addTen(2); // 12
```

这里表明的是一种“预加载”函数的能力，通过传递一到两个参数调用函数，就能得到一个记住了这些参数的新函数。

**使用 lodash**

```javascript
const _ = require("lodash");
const abc = function (a, b, c) {
  return [a, b, c];
};

const curry = _.curry(abc);

curry(1)(2)(3);
// => [1, 2, 3]

curry(1, 2)(3);
// => [1, 2, 3]

curry(1, 2, 3);
// => [1, 2, 3]

// 第二次调用时候，在第二个参数位置用 _ 占位，可以先传第三个参数，再传第二个参数
curry(1)(_, 3)(2);
// => [1, 2, 3]

const match = curry(function (what， str) {
  return str.match(what);
});

const hasSpaces = match(/\s+/g);
hasSpaces("hello world"); // [' ']
hasSpaces("spaceless"); // null
```

这种能力，类似于一种"继承"。 "子函数" 继承 "父函数"的运算能力，通过简单传递几个参数，就能动态创建使用的新函数，并且保留了数学函数的定义。

#### 代码组合\(compose\)

组合的简单实现：

```javascript
const compose = function (f, g) {
  return function (x) {
    return f(g(x));
  };
};

const toUpperCase = (x) => x.toUpperCase();
const exclaim = (x) => x + "!";
const shout = compose(exclaim， toUpperCase);

shout("send in the clowns"); //=> "SEND IN THE CLOWNS!"

// 不用组合的 shout 函数
const shout = function (x) {
  return exclaim(toUpperCase(x));
};
```

组合将代码的由内向外运行改为了从右向左运行，避免了嵌套层级太深导致代码逻辑难以捋清的情况。类似 Promise 对回调地狱的拯救。  
组合像一系列管道那样把不同的函数联系在一起，数据就可以也必须在其中流动。

### 最后

如果你觉得函数式编程会增加代码的复杂性、可读性，不要使用它!

实际上，有些函数式编程中的工具函数会将代码变得阅读困难，并不是书里介绍的那样"让我们的代码简单而富有可读性"。

介绍函数式编程不是要大家全部去使用函数式编程，而是介绍一种函数的思想，我认为它优秀的思想在以下几点：

- 相同的输入永远会得到相同的输出
- 纯函数不依赖环境变量，如果要依赖，将环境变量作为参数传进去，而不是"偷偷"使用。
- 处理复杂对象的函数最佳实践是：**传入复杂对象** -&gt; **处理** -&gt; **传出这个对象** \(如果可能的话，可以 **深复制这个对象** -&gt; **处理新对象** -&gt; **传出这个新对象**\)
- 将系统功能拆分成尽可能小的单元模块，每个单元尽可能使用纯函数去实现功能，形成一个业务纯函数池。函数池中的功能模块提供给所有上层功能使用，提高软件的可移植性和可扩展性。\(这不就是 lodash 干的事情吗\)
