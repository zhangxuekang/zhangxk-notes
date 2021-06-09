# 使用 draft.js 构建富文本编辑器

[Draft.js](https://draftjs.org/)是一个构建富文本编辑器的 React 框架, 它不是一个富文本编辑器的组件库. draft.js 提供构建编辑器的工具, 如何实现, 需要开发者自己去设计. 砖头和水泥都有了, 就差个程序员去盖房子了.

## 特点

- 大部分编辑器保存的富文本数据都是 html, 数据不够结构化, 查询修改数据很不容易. 而 Draft.js 提供结构化的数据, 表现能力更加强大.
- 实现富文本功能的过程中你会发现, Draft.js 没有直接操作 dom. 数据和渲染的完全分离, 使开发者只需要关注数据层.
- 在 Draft.js 中, 所有的事情都是开发者自己去定制的, 灵活性高, 可扩展性强.
- 不管是多样的行内样式还是复杂块级样式, 使用 Draft.js 都可以方便配置.

## 开始使用

### 安装

Draft.js 依赖 React 和 React DOM, 确保项目中安装了这两项.

```bash
npm install --save draft-js react react-dom
# 或者
yarn add draft-js react react-dom
```

### 基础使用

```js
import React from 'react';
import ReactDOM from 'react-dom';
import { Editor, EditorState } from 'draft-js';

class MyEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { editorState: EditorState.createEmpty() };
    this.onChange = (editorState) => this.setState({ editorState });
  }
  render() {
    return (
      <Editor editorState={this.state.editorState} onChange={this.onChange} />
    );
  }
}

ReactDOM.render(<MyEditor />, document.getElementById('container'));
```

如果配置正常的话, 应该能看到一个可输入区域.

简单看下是怎么实现的, 使用过 React 表单控件的开发应该知道:

> 其值由 React 控制的输入表单元素称为“受控组件”。

Draft.js 构建的富文本编辑器也是一个"受控组件", 使用方法和 input 控件一样, 指定数据源(this.state.editorState), 添加控制函数(this.onChange). onChange 方法触发后, Draft.js 会将最新的 editorState 作为参数传出来, 用新数据渲染, 实现同步更新.

因为还没有配置富文本渲染方法, 所以目前还是纯文本编辑器. [Draft.css](https://github.com/facebook/draft-js/issues/1744)文件是默认的渲染样式, 需要在项目中引入生效.

## 行内样式

### 快捷键

RichUtils 模块拥有很多操作富文本的方法, 现在我们使用 RichUtils.handleKeyCommand 来实现快捷键修改文本样式的功能.

```js
class MyEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { editorState: EditorState.createEmpty() };
    this.onChange = (editorState) => this.setState({ editorState });
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
  }
  handleKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  }
  render() {
    return (
      <Editor
        editorState={this.state.editorState}
        handleKeyCommand={this.handleKeyCommand}
        onChange={this.onChange}
      />
    );
  }
}
```

handleKeyCommand 是控制键盘快捷键的接口.

Draft.js 默认的快捷键有 Cmd+B(加粗), Cmd+I(斜体)等, 当然, 你也可以自己定义快捷键.

```js
import {Editor, getDefaultKeyBinding, KeyBindingUtil} from 'draft-js';
const {hasCommandModifier} = KeyBindingUtil;
class MyEditor extends React.Component {
  // ...
  handleKeyCommand(command: string): DraftHandleValue {
    if (command === 'my-key') {
      // do something ...
      // 必须返回'handled', 告诉Draft.js采用修改,设置新的editorState
      return 'handled';
    }
    return 'not-handled';
  }
  render() {
    return (
      <Editor
        editorState={this.state.editorState}
        handleKeyCommand={this.handleKeyCommand}
        keyBindingFn={myKeyBindingFn}
        ...
      />
    );
  }
}

function myKeyBindingFn(e: SyntheticKeyboardEvent): string {
  if (e.keyCode === 83 && hasCommandModifier(e)) {
    return 'my-key';
  }
  return getDefaultKeyBinding(e);
}
```

### 按钮

在开发富文本编辑器中, 最常用的还是样式按钮. 看 Draft.js 如何监听一次点击事件设置样式.

```js
class MyEditor extends React.Component {
  // …
  handleBoldClick() {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
  }
  render() {
    return (
      <div>
        <button onClick={this.handleBoldClick.bind(this)}>Bold</button>
        <Editor
          editorState={this.state.editorState}
          handleKeyCommand={this.handleKeyCommand}
          onChange={this.onChange}
        />
      </div>
    );
  }
}
```

RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD')将当前选择的文字设置为加粗样式, 返回修改后的 editorState, 'BOLD'是 Draft.js 设置好的样式名称, 其他的还有'ITALIC', 'UNDERLINE', 和 'CODE'. 这些样式名称可以直接使用. 要想获得丰富的富文本样式, 肯定要自己定义一套样式规则.

```js
import {Editor} from 'draft-js';
/**
 * styleMap用来定义渲染规则
 * key值是样式的名称, 在RichUtils.toggleInlineStyle(EditorState, key)中使用
 * value是渲染的css规则, 其中用驼峰格式来标识样式属性
 **/
const styleMap = {
  'STRIKETHROUGH': {
    textDecoration: 'line-through',
  },
  'COLOR_RED': {
    color: 'red'
  }
};
class MyEditor extends React.Component {
  // ...
  handleLineThrough() {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'COLOR_RED'));
  }
  render() {
    return (
      <div>
        <button onClick={this.handleLineThrough.bind(this)}>删除线</button>
        <Editor
          customStyleMap={styleMap} // 必须在这里指定自定义的样式规则
          editorState={this.state.editorState}
          ...
        />
      </div>
    );
  }
}
```

现在, 行内样式已经搞定了. 在实际开发中, 最好将行内样式定义放在一个单独的文件中, 在要使用的地方用 import 导入进来, 更近一步可以将执行修改的逻辑也放在控制层, 组件只负责渲染.

## 块级样式

Draft.js 提供了常用的块级样式类型:

| HTML element   | Draft block type                          |
| :------------- | :---------------------------------------- |
| <h1/\>         | header-one                                |
| <h2/\>         | header-two                                |
| <h3/\>         | header-three                              |
| <h4/\>         | header-four                               |
| <h5/\>         | header-five                               |
| <h6/\>         | header-six                                |
| <blockquote/\> | blockquote                                |
| <pre/\>        | code-block                                |
| <figure/\>     | atomic                                    |
| <li/\>         | unordered-list-item,ordered-list-item\*\* |
| <div/\>        | unstyled\*\*\*                            |

blockStyleFn 属性可以让开发者自己定义渲染块级样式的 class, 贴上官网的例子:

```js
import {Editor} from 'draft-js';
function myBlockStyleFn(contentBlock) {
  const type = contentBlock.getType();
  if (type === 'blockquote') {
    return 'superFancyBlockquote';
  }
}
class EditorWithFancyBlockquotes extends React.Component {
  render() {
    return <Editor ... blockStyleFn={myBlockStyleFn} />;
  }
}
```

然后在 css 文件中定义 superFancyBlockquote 类的样式:

```css
.superFancyBlockquote {
  color: #999;
  font-family: 'Hoefler Text', Georgia, serif;
  font-style: italic;
  text-align: center;
}
```

blockRenderMap 属性可以让开发者自己定义块的渲染规则, 可以覆盖默认规则, 也可以添加新的规则.

```js
const blockRenderMap = Immutable.Map({
  'header-two': {
    element: 'div' // 覆盖了默认的规则
  },
  // 定义新类型
  'ul-disc': {
    element: 'li', // 渲染标签
    wrapper: React.createElement('ul', { className: 'public-DraftStyleDefault-ul ul-disc' }) // 定义包裹的组件, 类名加上默认的类名和自定义的
  }
});
// 需要merge到默认的规则里边
const extendedBlockRenderMap = DefaultDraftBlockRenderMap.merge(getBlockRender())

class RichEditor extends React.Component {
  //...
  handleUlClick() {
    this.onChange(
      RichUtils.toggleBlockType(
        this.state.editorState,
        'ul-disc'
    ));
  }
  render() {
    return (
      <div>
        <button onClick={this.handleUlClick.bind(this)}>UL</button>
        <Editor
          ...
          blockRenderMap={extendedBlockRenderMap}
        />
      </div>
    );
  }
}
```

需要在自己的样式表中定义.ul-disc 的样式, 样式表必须引入才能生效:

```css
.ul-disc {
  list-style-type: disc;
}
```

## 总结

先附上自己写的初版富文本链接[demo](https://zhangxuekang.github.io/rich-text/).

![富文本编辑器](https://zhangxuekang.github.io/src/blog/draft-rich-text/text-editor.png) 这就是 Draft.js 的基础应该用, 更多的功能例如超链接, 图片等有时间再撰文介绍. 打铁还需自身硬, 要想使用好 Draft.js, 要需要自己去多研究多实践. 官网介绍挺全的(就是一些 API 很不友好). 附上官网的链接[https://draftjs.org/](https://draftjs.org/). 知乎也是用的 Draft.js 构建的富文本编辑器, 但是知乎也只用了 Draft.js 的皮毛, 足以支撑起一个普通的文章编辑和评论编辑器了. 如果你想要构建一个 online word, 只能祝你好运. 附上两篇相关文章:

_[Draft.js 在知乎的实践](https://zhuanlan.zhihu.com/p/24951621)_

_[为什么都说富文本编辑器是天坑?](https://www.zhihu.com/question/38699645)_
