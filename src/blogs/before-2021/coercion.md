# 当你在 javascript 中用"=="的时候, 你在比较什么?

## 类型转换

&nbsp;&nbsp;js 中存在强制类型转换和隐式类型转换, 有意识地去调用转换方法或者构造函数去转换称为强制类型转换(implicit coercion), 无意识地转换(语言机制自发完成)称为隐式类型转换(explicit coercion).

```js
const a = 42;
const b = a + ''; // implicit coercion
const c = String(a); // explicit coercion
```

这里稍后会讨论的"=="问题, 涉及到的也是隐式类型转换. 转换的目标只能是 string, number or boolean. 不可能经过隐式类型转换, 转换出一个复杂类型的数据(Object, Array, Function ...). 现在来看看各个类型的 ToString,ToNumber, ToBoolean, 或者说是 ToPrimitive.

### ToString

- 原生简单对象转化规则 **null**: 转化为字符串"null"; **undefined**: 转化为"undefined"; **true/false**: 转化为"true"/"false"; **Number**: 大部分情况如预测地那样, 2 转化为"2", 0 转化为"0", 100 转化为"100". 但是事情没有这么简单. 不是 10 进制的数字, 首先会转化为十进制, 然后再转化为字符串, 并不是数字直接加上引号就行了.
  ```js
  (0x23).toString(); // "35"
  0x23 == '35'; // true
  ```
  绝对值很大的数值或者绝对值很小的数值, 首先会转化为科学计数法, 然后再进行转化.
  ```js
  (0.0000001)
    .toString()(
      // "1e-7"
      1000000000000000000000
    )
    .toString(); // "1e+21"
  0.0000001 == '1e-7'; // true
  ```
- 复杂对象的转化规则 **Object**: 如果没有指定自己的 toString()方法, 就会调用 Object.prototype.toString(). 这个函数会返回对象类型字符串, 在这里是"[object Object]". 如果指定了自己的 toString()函数, 会执行这个函数, 使用返回值.
  ```js
  const obj = {
    value: 42,
  };
  const obj42 = {
    value: 42,
    toString: () => {
      return 'ultimate';
    },
  };
  obj == '[object Object]'; // true
  obj42 == 'ultimate'; // true
  ```
  **Array**: Array 类型"重载"了 Object.prototype.toString(), toString 方法返回有一个以","隔开的数组元素拼接的字符串.
  ```js
  const arr = ['a', 'b', 'c', 'd', 'e', 'f'];
  console.log(arr); // "a,b,c,d,e,f"
  // 修改数组的默认toString方法 别这样做
  Array.prototype.toString =
    function () {
      return this.split('-');
    }[('a', 'b', 'c', 'd', 'e', 'f')] == 'a-b-c-d-e-f'; // true
  ```
  **Function**: Function 类型也重载了 Object.prototype.toString(), 个性化的 toString 返回函数的字符串形式.
  ```js
  (function () {
    var s = 2;
    return s;
  } == 'function(){var s = 2;return s}');
  ```

### ToNumber

- 基本类型转化规则 **null**: 转化为 0!; **undefined**: 转化为 NaN; **true/false**: 转化为 1/0; **String**: 字符串会尝试使用 Number()构造函数(误)去转化结果, 转化失败不会报错, 会返回特殊的数字类型值 NaN. 在这种操作中可以正确辨识以 0x(0X)为起始符号的 16 进制的数字字符串, 但是会忽略以"0"起始的部分.
  ```js
  10 - null; // 10
  isNaN(undefined); // true
  1 + true; // 2
  2 - false; // 2
  20 - '0xb'; // 9
  20 - '013'; // 7
  ```
  还有一种特殊情况是, 如果是合法的科学计数法数字字符串, 能正常转化为 10 进制的数字
  ```js
  '1e+10' == 10000000000; // true
  ```
- 复杂对象的转化规则首先复杂对象会调用内部的 ToPrimitive 方法, 尝试转化成基础类型值, 如果基础类型值不是 number, 则再进行转化. 调用 ToPrimitive 可以想成首先尝试调用对象的 valueOf()方法, 如果有这个方法并且返回的是基础类型值则使用返回值, 否则就尝试调用 toString()方法. 如果这两个方法都不存在或者返回值都不是基础类型值, 会抛出 TypeError 错误.
  ```js
  const a = {
    valueOf: () => {
      return '1';
    },
  };
  10 - a; // 9
  const b = {
    toString: () => {
      return '2';
    },
  };
  10 - b; // 8
  const c = {
    valueOf: () => {
      return '3';
    }, // 首先调用
    toString: () => {
      return '4';
    },
  };
  10 - c; // 7
  const d = {
    valueOf: () => {
      return {};
    }, // 首先调用
    toString: () => {
      return '5';
    }, // 调用valueOf结果不对, 调用toString
  };
  10 - d; // 5
  const e = Object.create(null);
  10 - e; // TypeError
  ```

### ToBoolean

先来看一定是 false 的几个值

- undefined
- null
- false
- +0, -0, and NaN
- ""

这个列表外的值, 都是 true(误, 有例外). 复杂类型的值都是 true(误, 有例外)

```js
!!new Boolean(false); // true
!!new Boolean(0); // true
```

在史前时代, 人们判断是不是 IE 浏览器, 往往用这样的代码:

```js
if (document.all) {
  /* it's IE */
}
```

结果慢慢地, 别的浏览器也开始有这个 API 了. 可是旧代码已经沉淀下来成了地层中的岩石, 挖出来修改的成本太高了, 干脆在非 IE 浏览器中 document.all 是 falsy 算了, 所以导致了这个对象的奇葩行为.

```js
!!document.all; // true 在IE11以下版本
!!document.all; // false 在IE11以上版本或非IE环境
```

## "==" VS. "==="

两者的区别是: "=="比较的时候, 允许隐式类型转换, "==="不允许隐式类型转换. 稍微提下"==="的两个奇葩行为:

- NaN === NaN // false
- -0 === +0 // true

## "=="规则

```js
42 === '42'; // false
42 == '42'; // true
```

问题来了, 42 == '42'到底隐式转换成了什么? 是 42 == 42 还是'42'=='42'? 接下来就详细介绍下转换的规则, 了解这些规则后, "=="很多诡异的行为都变得有理有据, 再也不用视为"糟粕"不敢用了.

### String VS. Number

> If Type(x) is Number and Type(y) is String, return the result of the comparison x == ToNumber(y). If Type(x) is String and Type(y) is Number, return the result of the comparison ToNumber(x) == y.

如果"=="两边是字符串和数字, 那么字符串转化为数字去比较. 字符串转化为数字的规则, 上边有介绍.

### Anything VS. Boolean

> If Type(x) is Boolean, return the result of the comparison ToNumber(x) == y. If Type(y) is Boolean, return the result of the comparison x == ToNumber(y).

如果"=="两边是 Boolean 值和其他值, 那么第一步会将 Boolean 值转化为数字, 转化的结果只能是 0 或 1. 然后再用 0 或 1 去和其他值比较, 如果其他值是复杂类型的值, 再进行其他转换, 如果是字符串, 参考上一条.

```js
true == '1'; // 1 == '1' -> 1 == 1 true
true == '42'; // 1 == '42' -> 1 == 42 false
```

### null VS. undefined

> If x is null and y is undefined, return true. If x is undefined and y is null, return true.

如果是 null 和 undefined 作比较, 返回 true. 这俩哥们和其他的任何值作比较, 都返回 false.

```js
const a = null;
const b = undefined;
a == b; // true
a == null; // true
b == null; // true
a == false; // false
b == false; // false
a == ''; // false
b == ''; // false
a == 0; // false
b == 0; // false
```

### Objects VS. non-Objects

> If Type(x) is either String or Number and Type(y) is Object, return the result of the comparison x == ToPrimitive(y). If Type(x) is Object and Type(y) is either String or Number, return the result of the comparison ToPrimitive(x) == y.

当复杂类型与基本类型作比较的时候, 复杂类型值首先要转换成基本类型的值, 转化规则前边有介绍.

```js
['42'] == 42; // true
Object(10) == '10'; // true
```

两点需要注意, 构造函数的参数是 null 或者 undefined, 会返回一个"空"对象, 所以下边的结果是有道理的.

```js
const a = Object(null); // {}
a == null; // false
const b = Object(undefined); // {}
b == undefined; // false
```

## 最后练习

```js
[] == ![]; // true [] == false -> [] == 0 -> "" == 0 -> 0 == 0

2 == [2]; // true  2 == "2" -> 2 == 2

'' == [null]; // true  "" == ""  (ps: String([null]) === "";  String(null) === "null")

'0' == false; // true "0" == 0 -> 0 == 0

false == 0; // true 0 == 0

false == ''; // true 0 == "" -> 0 == 0

false == []; // true 0 == [] -> 0 == "" -> 0 == 0

'' == 0; // true 0 == 0

'' == []; // true "" == ""

0 == []; // true 0 == "" -> 0 == 0
```
