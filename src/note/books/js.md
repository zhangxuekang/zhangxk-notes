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

1. 一个 Event Loop 可以有一个或多个事件队列，但是只有一个微任务队列。
2. 微任务队列全部执行完会重新渲染一次
3. 每个宏任务执行完都会重新渲染一次
4. requestAnimationFrame 处于渲染阶段，不在微任务队列，也不在宏任务队列

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
