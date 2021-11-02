声明提升，相同的函数会覆盖上一个函数，并且函数声明优先于变量声明。

---

箭头函数其实是没有 this 的，this 在箭头函数里就是个普通变量，取的是最近的非箭头函数环境的 this 值。

---

setTimeout 和 setInterval 都返回一个整数，这个整数就是 id 值，这个值是两者公用的

返回值 timeoutID 是一个正整数，表示定时器的编号。这个值可以传递给 clearTimeout()来取消该定时器。需要注意的是 setTimeout()和 setInterval()共用一个编号池，技术上，clearTimeout()和 clearInterval() 可以互换。但是，为了避免混淆，不要混用取消定时函数。

---

## 事件循环

1. 首先 js 是**单线程**运行的，在代码执行的时候，通过将不同函数的**执行上下文**压入**执行栈**中来保证代码的有序执行。
2. 在执行**同步代码**的时候，如果遇到了**异步事件**，js 引擎并不会一直等待其返回结果，而是会将这个事件**挂起**，继续执行执行栈中的其他任务
3. 当**同步事件**执行完毕后，再将异步事件对应的回调加入到与**当前执行栈中不同的另一个任务队列**中等待执行。
4. 任务队列可以分为**宏任务**队列和**微任务**队列，当前执行栈中的事件执行完毕后，js 引擎首先会判断微任务对列中是否有任务可以执行，如果有就将微任务队首的事件压入栈中执行。
5. 当微任务对列中的任务都执行完成后再去判断宏任务对列中的任务。

宏任务是由宿主发起的，而微任务由 JavaScript 自身发起。

在 ES3 以及以前的版本中，JavaScript 本身没有发起异步请求的能力，也就没有微任务的存在。在 ES5 之后，JavaScript 引入了 Promise，这样，不需要浏览器，JavaScript 引擎自身也能够发起异步任务了。

Node 里面对 setTimeout 的特殊处理：setTimeout(fn, 0)会被强制改为 setTimeout(fn, 1)。

HTML 5 里面 setTimeout 最小的时间限制是 4ms

nextTick 和 Promise 同时出现时，肯定是 nextTick 先执行，原因是 nextTick 的队列比 Promise 队列优先级更高。

执行每个宏任务之前都要检查下微任务队列是否有任务，如果有，优先执行微任务队列。

1. event loop 每轮的 task 执行完成后，**不一定**都会伴随页面的更新渲染；

   - 是否需要进行更新渲染，会根据浏览器刷新率以及页面性能或是否后台运行等因素判断的。
   - 大多数显示器的刷新频率是 60Hz，浏览器也会尽量保持 60Hz 的刷新率运行，也就是 16.7ms 刷新一帧，所以如果定时器的延迟时间小于 16.7ms 时，可能就不会刷新。
   - task 循环调用时，不会阻塞页面的渲染。
   - 循环调用微任务时，就会阻塞页面的渲染。

2. task、microtask 和 RAF 对应队列的执行：

   1. 每一轮 loop 对应一个 task；
   2. microtask 队列则会在每一轮 loop 中全部执行完毕（包含嵌套产生的 microtask）；
   3. RAF 队列中当前 task 中产生的 RAF 会在每一轮 loop 执行完毕，嵌套的 RAF 则在下一帧之前执行。

3. RAF 回调的执行与 task 和 microtask 无关，而是与浏览器是否渲染相关联的；
   1. 渲染前会执行 resize 和 scroll 事件回调
   2. 渲染前执行 RAF

### 宏任务:

1. script (可以理解为外层同步代码)
2. setTimeout/setInterval
3. setImmediate(Node.js)
4. I/O
5. UI 事件
6. postMessage

### 微任务:

1. Promise
2. process.nextTick(Node.js)
3. Object.observe
4. MutaionObserver

### Node.js 的 Event Loop:

1. timers: 执行 setTimeout 和 setInterval 的回调
2. pending callbacks: 执行延迟到下一个循环迭代的 I/O 回调
3. idle, prepare: 仅系统内部使用
4. poll: 检索新的 I/O 事件;执行与 I/O 相关的回调。事实上除了其他几个阶段处理的事情，其他几乎所有的异步都在这个阶段处理。
5. check: setImmediate 在这里执行
6. close callbacks: 一些关闭的回调函数，如：socket.on('close', ...)

### setImmediate VS setTimeout

**在一个异步流程**里，setImmediate 会比定时器先执行

```js
console.log("outer");

setTimeout(() => {
  setTimeout(() => {
    console.log("setTimeout");
  }, 0);
  setImmediate(() => {
    console.log("setImmediate");
  });
}, 0);

// outer
// setImmediate
// setTimeout
```

1. 外层是一个 setTimeout，所以执行他的回调的时候已经在 timers 阶段了
2. 处理里面的 setTimeout，因为本次循环的 timers 正在执行，所以他的回调其实加到了下个 timers 阶段
3. 处理里面的 setImmediate，将它的回调加入 check 阶段的队列
4. 外层 timers 阶段执行完，进入 pending callbacks，idle, prepare，poll，这几个队列都是空的，所以继续往下
5. 到了 check 阶段，发现了 setImmediate 的回调，拿出来执行
6. 然后是 close callbacks，队列是空的，跳过
7. 又是 timers 阶段，执行我们的 console

写在最外层:

```js
console.log("outer");

setTimeout(() => {
  console.log("setTimeout");
}, 0);

setImmediate(() => {
  console.log("setImmediate");
});
```

// outer
// setTimeout 和 setImmediate 顺序不定

1. 外层同步代码一次性全部执行完，遇到异步 API 就塞到对应的阶段
2. 遇到 setTimeout，虽然设置的是 0 毫秒触发，但是被 node.js 强制改为 1 毫秒，塞入 times 阶段
3. 遇到 setImmediate 塞入 check 阶段
4. 同步代码执行完毕，进入 Event Loop
5. 先进入 times 阶段，检查当前时间过去了 1 毫秒没有，如果过了 1 毫秒，满足 setTimeout 条件，执行回调，如果没过 1 毫秒，跳过
6. 跳过空的阶段，进入 check 阶段，执行 setImmediate 回调

---

## 垃圾回收

### 引用计数

此算法把“对象是否不再需要”简化定义为“对象有没有其他对象引用到它”。如果没有引用指向该对象（零引用），对象将被垃圾回收机制回收。

限制：无法处理循环引用的事例。

### 标记清除

这个算法把“对象是否不再需要”简化定义为“对象是否可以获得”。这个算法假定设置一个叫做根（root）的对象（在 Javascript 里，根是全局对象）。垃圾回收器将定期从根开始，找所有从根开始引用的对象，然后找这些对象引用的对象……从根开始，垃圾回收器将找到所有可以获得的对象和收集所有不能获得的对象。

从 2012 年起，所有现代浏览器都使用了标记-清除垃圾回收算法。

限制: 那些无法从根对象查询到的对象都将被清除

尽管这是一个限制，但实践中我们很少会碰到类似的情况，所以开发者不太会去关心垃圾回收机制。

## 深浅拷贝

### 浅拷贝

Array 中存在一些可以实现浅拷贝的方法：slice、concat...

一般的对象可以用 Object 的方法：assign

也可以使用 ES6 提供的新的语法(对象和数组都可以使用)："..."

### 深拷贝

parse、stringify `var newObj = JSON.parse(JSON.stringify(obj));` 。该方法会忽略 undefined、任意的函数、symbol 值，因为 JSON 不支持这些数据类型。

递归实现(极度简单)：

```js
function deepClone(obj) {
  if (obj && typeof obj === "object") {
    const result = Array.isArray(obj) ? [] : {};
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (obj[key] && typeof obj[key] === "object") {
          result[key] = deepClone(obj[key]);
        } else {
          result[key] = obj[key];
        }
      }
    }
    return result;
  } else {
    return obj;
  }
}
```

## this 的指向

1. 用 new 调用函数， this 指向新创建的对象。
2. 使用 call，apply（bind）调用函数， this 指向绑定的的对象。
3. 函数作为某对象的属性调用， this 指向这个对象。
4. 其他情况下， this 指向全局对象（严格模式下指向 undefined）。

补充： 如果第二条规则绑定的是 null 或者 undefined， 则执行第四条规则； 1-4 条规则优先级递减。

## new 操作符做的事情

1. 新生成一个新对象
2. 链接到原型
3. 绑定 `this`
4. 返回新对象

## node 读写大文件

流是一种抽象的数据结构。想象水流，当在水管中流动时，就可以从某个地方（例如自来水厂）源源不断地到达另一个地方（比如你家的洗手池）。有些流用来读取数据，比如从文件读取数据时，可以打开一个文件流，然后从文件流中不断地读取数据。在 Node.js 中，流也是一个对象，我们只需要响应流的事件就可以了：data 事件表示流的数据已经可以读取了，end 事件表示这个流已经到末尾了，没有数据可以读取了，error 事件表示出错了。

流读取数据：

```js
var fs = require("fs");

// 打开一个流:
var rs = fs.createReadStream("sample.txt", "utf-8");

// data事件可能会有多次，每次传递的chunk是流的一部分数据。
rs.on("data", function (chunk) {
  console.log("DATA:");
  console.log(chunk);
});

rs.on("end", function () {
  console.log("END");
});

rs.on("error", function (err) {
  console.log("ERROR: " + err);
});
```

## 箭头函数

1. 箭头函数没有自己的 `this` 对象
2. 不可以当作构造函数，也就是说，不可以对箭头函数使用 `new` 命令，否则会抛出一个错误。
3. 不可以使用 `arguments` 对象，该对象在函数体内不存在。
4. 不可以使用 `yield` 命令，因此箭头函数不能用作 `Generator` 函数

对于普通函数来说，内部的 `this` 指向函数运行时所在的对象，但是这一点对箭头函数不成立。它没有自己的 `this` 对象，内部的 `this` 就是**定义时**上层作用域中的 `this`。也就是说，箭头函数内部的 `this` 指向是固定的，相比之下，普通函数的 `this` 指向是可变的。

```js
function foo() {
  setTimeout(() => {
    console.log("id:", this.id); // 这个 this 是函数 foo 里的 this
  }, 100);
}

var id = 21;

foo.call({ id: 42 }); // id: 42

function bar() {
  setTimeout(function () {
    console.log("id:", this.id); // 这个 this 在运行的时候会指向 window
  }, 100);
}

var id = 24;

bar.call({ id: 42 });
```

Babel 转箭头函数产生的 ES5 代码：

```js
// ES6
function foo() {
  setTimeout(() => {
    console.log("id:", this.id);
  }, 100);
}

// ES5
function foo() {
  var _this = this;

  setTimeout(function () {
    console.log("id:", _this.id);
  }, 100);
}
```

需要注意，函数中才有 `this`，`Object` 中没有 `this`，`this` 的指向是 `Object`：

```js
// ES6
const cat = {
  lives: 9,
  jumps: () => {
    this.lives--; // 指向了全局
  },
};

// ES5
var _this = this;
var cat = {
  lives: 9,
  jumps: function () {
    _this.lives--;
  },
};
```

ES6 的 `Class` 本质也是函数，所以里边的箭头函数指向了该 `Class` 实例：

```js
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  getX = () => {
    console.log("arrow", this);
    console.log(this.x);
  };

  getY() {
    console.log("function", this);
    console.log(this.y);
  }
}

const point = new Point(1, 2);

// 作为实例属性调用，都指向实例
point.getX();
// arrow Point {x: 1, y: 2, getX: ƒ}
// 1
point.getY();
// function Point {x: 1, y: 2, getX: ƒ}
// 2

// 作为单独的函数调用，箭头函数的指向不变，依然是实例，普通函数指向 undefined
const { getX, getY } = point;
getX();
// arrow Point {x: 1, y: 2, getX: ƒ}
// 1
getY();
// function undefined
// Uncaught TypeError: Cannot read properties of undefined (reading 'y')
```

箭头函数属性和普通函数属性在类中的继承细节：

```js
class B {
  print = () => {
    // 函数1
    console.log("print b");
  };
}

class D extends B {
  print() {
    // 函数2
    super.print();
    console.log("print d");
  }
}

const d = new D();
// 实际上只会运行一次函数1，函数2不运行
d.print(); // print b
```

常规的写法中，类的非静态属性都是定义在类的原型对象上，而不是类的实例上的。但箭头函数不一样，通过箭头函数定义的方法时绑定在 `this` 上，而 `this` 是指向当前创建的类实例对象，而不是类的原型对象。

可以查看类转换后的代码：

```js
var B = function B() {
  _classCallCheck(this, B);

  // 箭头函数绑定在了 this 上，不是原型上
  this.print = function () {
    console.log("print b");
  };
};

function D() {
  // 继承自 B
  this.print = function () {
    console.log("print b");
  };
}

// 通过原型实现继承
D.__proto__ = B;
D.prototype.__proto__ === B.prototype;

D.prototype.print = function () {
  // 类 D 自身定义的 print 方法
};

const d = new D();
// print 会先取实例中的属性，取到就不会在原型中找了。
d.print(); // print b
```

延伸：ES6 的继承和 ES5 的继承有什么区别？

> ES5 的继承，实质是先创造子类的实例对象 `this`，然后再将父类的方法添加到 `this` 上面（`Parent.apply(this)`）。ES6 的继承机制完全不同，实质是先将父类实例对象的属性和方法，加到 `this` 上面（所以必须先调用 `super` 方法），然后再用子类的构造函数修改 `this`。

## Promise

```js
new Promise((resolve, reject) => {
  resolve(1);
  console.log(2);
}).then((r) => {
  console.log(r);
});

// 2
// 1
```

上面代码中，调用 `resolve(1)` 以后，后面的 `console.log(2)` 还是会执行，并且会首先打印出来。这是因为立即 `resolved` 的 `Promise` 是在本轮事件循环的末尾执行，总是晚于本轮循环的同步任务。
