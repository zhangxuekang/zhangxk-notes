---
title: 不可变数据简介
date: 2021
tags:
  - javascript
  - 不可变数据
header_image: https://source.unsplash.com/random
---

- [不可变数据简介](#不可变数据简介)
- [优势](#优势)
- [弊端](#弊端)
- [简单 API](#简单-api)
- [实现](#实现)
- [官方使用实践](#官方使用实践)

### 不可变数据简介

> Immutable data cannot be changed once created, leading to much simpler application development, no defensive copying, and enabling advanced memoization and change detection techniques with simple logic. Persistent data presents a mutative API which does not update the data in-place, but instead always yields new updated data. --- immutable.js 官网

Immutable Data 就是一旦创建，就不能再被更改的数据。如果尝试调用方法去修改，就会返回一个新的数据，原来的数据不会改变。想达到的效果基本和 deepCopy 一样，但是没有 deepCopy 将所有节点进行复制一遍带来的性能损耗。

immutable.js 和 immer.js 使用了一样的“深复制”策略，即如果对象树中一个节点发生变化，只修改这个节点和受它影响的父节点，其它节点则进行共享。

![clone](../assets/immutable)

### 优势

1. 构建线程安全的数据。Immutable 的引用数据可以同时在多处安全的被使用，不必担心出现意外的数据变化。
2. 和 react 结合使用，避免过多的 render 过程，提高 react 项目性能。
3. 方便记录数据变化过程，很容易就可以实现“撤回”操作。
4. 符合函数式编程的原则

### 弊端

1. 学习成本，入手不易。
2. 不便于调试，数据打印在控制台后，不得不翻来覆去深层次的找。
3. 不符合主流 ES6 原生代码的格式，不能解构，不能使用扩展语法。
4. 侵入性强，例如引用第三方组件的时候，不得不进行数据转换，当数据量大时，必然导致性能问题。

### 简单 API

_To Be Continued_

### 实现

_To Be Continued_

### 官方使用实践

> Draft.js is a framework for building rich text editors in React, powered by an immutable model and abstracting over cross-browser differences. --- Draft.js 官网

Draft.js 是 Facebook 开源的用于构建富文本编辑器的 JavaScript 框架。Draft.js 基于 React，Draft.js 提供的 Editor 对象是一个 React 组件，可以完美融入 React 项目之中。

使用 Draft.js，富文本的状态被封装到一个 EditorState 类型的 immutable 对象中，这个对象作为组件属性（函数参数）输入给 Editor 组件（函数）。一旦用户进行操作，比如敲一个回车，Editor 组件的 onChange 事件触发，onChange 函数返回一个全新的 EditorState 实例，Editor 接收这个新的输入，渲染新的内容。这种机制使得撤回操作很容易被实现。

```js
class MyEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { editorState: EditorState.createEmpty() }; // 创建空的 EditorState 对象
    this.onChange = (editorState) => this.setState({ editorState }); // 用全新的 EditorState 实例替换
  }
  render() {
    const { editorState } = this.state;
    return <Editor editorState={editorState} onChange={this.onChange} />;
  }
}
```

> - [https://immutable-js.com/](https://immutable-js.com/)
> - [https://zhuanlan.zhihu.com/p/24951621](https://zhuanlan.zhihu.com/p/24951621)
> - [https://zhangxuekang.github.io/rich-text/](https://zhangxuekang.github.io/rich-text/)
