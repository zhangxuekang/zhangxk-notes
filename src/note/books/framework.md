## 写 React / Vue 项目时为什么要在列表组件中写 key

不带有 key，并且使用简单的模板，基于这个前提下，可以更有效的复用节点，diff 速度来看也是不带 key 更加快速的，因为带 key 在增删节点上有耗时。这就是 vue 文档所说的默认模式。但是这个并不是 key 作用，而是没有 key 的情况下可以对节点**就地复用**，提高性能。

这种模式会带来一些隐藏的副作用，比如可能不会产生过渡效果，或者在某些节点有绑定数据（表单）状态，会出现状态错位。

key 是给每一个 vnode 的唯一 id,可以依靠 key,更准确, 更快的拿到 oldVnode 中对应的 vnode 节点。

利用 key 的唯一性生成 map 对象来获取对应节点，比遍历方式更快。

## Vue VS React

- 使用 **Virtual DOM**
- 都具有基于**组件**的结构
- 提供了**响应式** (Reactive) 和组件化 (Composable) 的视图组件。
- 将注意力集中保持在核心库，而将其他功能如路由和全局状态管理交给相关的库。
- 单向数据流，所有的状态改变(mutation)可追溯，（用函数式来说，保证了组件就是无副作用的纯函数），不至于造成状态总被意外修改而导致难以维护的情况。bug 的排查范围被大大缩减了。

### 使用场景

Vue 最适合解决短期的小型的问题，快速迭代的项目。它的体积小巧。React 更偏向于构建稳定大型的应用，非常的科班化。相比之下，Vue 更偏向于简单迅速的解决问题，更灵活，不那么严格遵循条条框框。因此也会给人一种大型项目用 React，小型项目用 Vue 的感觉。

### 模板

在 React 中，所有的组件的渲染功能一般依靠 JSX。Vue 使用 Templates。

> (JSX) 你可以使用完整的编程语言 JavaScript 功能来构建你的视图页面。比如你可以使用临时变量、JS 自带的流程控制、以及直接引用当前 JS 作用域中的值等等。

事实上 Vue 也提供了渲染函数，甚至支持 JSX。然而，vue 推荐的还是模板。

> 模板比起 JSX 读写起来更自然。基于 HTML 的模板使得将已有的应用逐步迁移到 Vue 更为容易。
> 更抽象一点来看，我们可以把组件区分为两类：一类是偏视图表现的 (presentational)，一类则是偏逻辑的 (logical)。我们推荐在前者中使用模板，在后者中使用 JSX 或渲染函数。

React 是在组件 JS 代码中，通过原生 JS 实现模板中的常见语法，比如插值，条件，循环等，都是通过 JS 语法实现的，更加纯粹更加原生。而 Vue 是在和组件 JS 代码分离的单独的模板中，通过指令来实现的，比如条件语句就需要 v-if 来实现对这一点，这样的做法显得有些独特，会把 HTML 弄得很乱。

React 中没有“槽”（slot）这一概念的限制，你可以将任何东西作为 props 进行传递。Vue 使用“槽”，定义了槽的使用规则。

### 样式

CSS 作用域在 React 中是通过 CSS-in-JS 的方案实现的。这里 React 和 Vue 主要的区别是，Vue 设置样式的默认方法是单文件组件里类似 style 的标签。

### 更新状态

在 React 应用中，当某个组件的状态发生变化时，它会以该组件为根，重新渲染整个组件子树。如要避免不必要的子组件的重渲染，你需要在所有可能的地方使用 PureComponent，或是手动实现 shouldComponentUpdate 方法。在 Vue 应用中，组件的依赖是在渲染过程中自动追踪的，所以系统能精确知晓哪个组件确实需要被重渲染。你可以理解为每一个组件都已经自动获得了 shouldComponentUpdate，并且没有上述的子树问题限制。

### 监听数据变化的实现原理不同

Vue 通过 getter/setter 以及一些函数的劫持，能精确知道数据变化。React 默认是通过比较引用的方式（diff）进行的，如果不优化可能导致大量不必要的 VDOM 的重新渲染。

这是因为 Vue 和 React 设计理念上的区别，Vue 使用的是可变数据，而 React 更强调数据的不可变，两者没有好坏之分，Vue 更加简单，而 React 构建大型应用的时候更加合适。

#### Vue3.0 里为什么要用 Proxy API 替代 defineProperty API

**defineProperty API 的问题：**

- 检测不到对象属性的添加和删除
- 数组 API 方法无法监听到
- 需要对每个属性进行遍历监听，如果嵌套对象，需要深层监听，造成性能问题

**Proxy API：**

- `Proxy` 直接可以劫持整个对象，并返回一个新对象，我们可以只操作新的对象达到响应式目的
- 可以直接监听数组的变化（push、shift、splice）

### HoC 和 mixins

- Vue 组合不同功能的方式是通过 mixin。
- React 组合不同功能的方式是通过 HoC(高阶组件），高阶组件本质就是高阶函数，React 的组件是一个纯粹的函数，所以高阶函数对 React 来说非常简单。组件可以接受任意 props，包括基本数据类型，React 元素以及函数。

### 事件

React 组件绑定事件的本质是代理到 document 上。Vue 的事件挂载到真实的 DOM 节点。

react 自己定了一个 event 对象，存放着 onClick 回调们，在用户触发点击点击事件时，挨个检查并执行。

- 自行实现了一套事件捕获到事件冒泡的逻辑, 抹平各个浏览器之前的兼容性问题。
- 事件只在 document 上绑定，并且每种事件只绑定一次，减少内存开销。
- 使用对象池来管理合成事件对象的创建和销毁，可以减少垃圾回收次数，防止内存抖动。

## 组件声明周期

### Vue

- beforeCreate
- created
- beforeMoubt
- mounted
- beforeUpdate
- updated
- beforeDestroy
- destroyed

### React

- constructor
- render
- componentDidMount
- shouldComponentUpdate
- componentDidUpdate
- componentWillUnmount

## 为什么不可变性在 React 中非常重要

- 容易实现撤销和恢复功能
- 跟踪到数据的改变。跟踪数据的改变需要可变对象可以与改变之前的版本进行对比，这样整个对象树都需要被遍历一次。
  跟踪不可变数据的变化相对来说就容易多了。如果发现对象变成了一个新对象，那么我们就可以说对象发生改变了。
- 确定在 React 中何时重新渲染。帮助我们在 `React` 中创建 `pure components`。

## JSX

`Babel` 会把 `JSX` 转译成一个名为 `React.createElement()` 函数调用。`React.createElement(type, props, children)`

## React 中 setState

- 由 `React` 控制的事件处理程序，以及生命周期函数调用 `setState` 不会同步更新 `state` 。
- `React` 控制之外的事件中调用 `setState` 是同步更新的。比如原生 `js` 绑定的事件，`setTimeout/setInterval` 等。

原因： 在 `React` 的 `setState` 函数实现中，会根据一个变量 `isBatchingUpdates` 判断是直接更新 `this.state` 还是放到队列中回头再说，而 `isBatchingUpdates` 默认是 `false`，也就表示 `setState` 会同步更新 `this.state`，但是，有一个函数 `batchedUpdates`，这个函数会把 `isBatchingUpdates` 修改为 `true，而当` `React` 在调用事件处理函数之前就会调用这个 `batchedUpdates`，造成的后果，就是由 `React` 控制的事件处理过程 `setState` 不会同步更新 `this.state`。

好处：可以通过避免不必要的重新渲染来提升性能。

## 跨级传递数据的能力

React：Context 提供了一个无需为每层组件手动添加 props，就能在组件树间进行数据传递的方法。

Vue：provide 选项允许我们指定我们想要提供给后代组件的数据/方法，然后在任何后代组件里，我们都可以使用 inject 选项来接收指定的我们想要添加在这个实例上的 property。

## React 中的错误边界

如果一个 class 组件中定义了 `static getDerivedStateFromError()` 或 `componentDidCatch()` 这两个生命周期方法中的任意一个（或两个）时，那么它就变成一个错误边界。当抛出错误后，请使用 `static getDerivedStateFromError()` 渲染备用 `UI` ，使用 `componentDidCatch()` 打印错误信息。

# node.js

## 跟踪回调路径

```js
import { AsyncLocalStorage } from 'async_hooks';
const traceContext = new AsyncLocalStorage<string>();
export default traceContext;

// 起始函数中，注入 traceId
traceContext.run(traceId, next);

// 在回调中获取 traceId
export function getTraceId() {
  return traceContext.getStore();
}
```

## nest.js

### 优点

- 层层处理，一定程度上可以约束代码结构，比如何时使用中间件、何时需要使用 guards 守卫等。（洋葱模型）
- 依赖注入以及模块化的思想，使得代码结构清晰，便于维护
- 使用装饰器和注解，代码简洁
- 完美的支持 typescript,因此可以使用日益繁荣的 ts 生态工具
- 兼容 express 中间件，因为 express 是最早出现的轻量级的 node server 端框架，nestjs 能够利用所有 express 的中间件，使其生态完善
- 完美支持 rxjs

### 生命周期

一般来说，一个请求流经中间件、守卫与拦截器，然后到达管道，并最终回到拦截器中的返回路径中（从而产生响应）。

- 收到请求
- 全局绑定的中间件
- 模块绑定的中间件
- 全局守卫
- 控制层守卫
- 路由守卫
- 全局拦截器（控制器之前）
- 控制器层拦截器 （控制器之前）
- 路由拦截器 （控制器之前）
- 全局管道
- 控制器管道
- 路由管道
- 路由参数管道
- 控制器（方法处理器）
- 路由拦截器（请求之后）
- 控制器拦截器 （请求之后）
- 全局拦截器 （请求之后）
- 异常过滤器 （路由，之后是控制器，之后是全局）
- 服务器响应
