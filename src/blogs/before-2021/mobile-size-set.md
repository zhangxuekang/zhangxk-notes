---
title: 移动端页面元素尺寸解决方案之一
date: before 2021
tags:
  - 移动端
  - 适配
  - 尺寸
  - 前端
header_image: https://source.unsplash.com/random
---

如果 html5 要适应各种分辨率的移动设备,应该使用 rem 这样的尺寸单位.主流做法基本也都是这样做的.但是,如果 html5 页面是在 webview 中打开的,并且 webview 不是通常的手机视窗尺寸,而是占了部分页面,使用 rem 单位的转化标准就没有了通用性.面对这种情况,可以尝试以下的解决方案.
<img alt="非全屏的webview" src="https://zhangxuekang.github.io/src/blog/mobile-size-set/mobile-size.png" width="60%">

## 使用 transform 的 scale 来适配所有尺寸的 view

设计稿的尺寸一般是 px,那么写页面的时候,就使用 px 单位,大小和设计稿保持一致就好.内容区域的最外层使用 scale 缩放,缩放的比例根据内容区原始的尺寸与渲染区域(如果是 webview 中就是 webview 的大小,如果是浏览器中就是浏览器视窗的大小)的比例来决定的.

举个例子,写个 demo:

```html
<body>
  <div class="main"></div>
</body>
```

class 为 main 的 dev 是内容区域,内部可以随意添加布置元素.想达到的效果是 main 元素随着窗口等比例放大缩小,宽最大不超过视窗的宽,高最大不超过视窗的高.
main 元素关键样式:

```css
/* 宽高根据设计稿来就行,不必须是正方形区域 */
.main {
  position: absolute;
  width: 720px;
  height: 720px;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  transform-origin: center center;
}
```

页面加载好后,监听视窗尺寸的变化,修改 main 元素的 transform 属性:

```js
window.addEventListener("resize", updateSize);
window.addEventListener("load", updateSize);
function updateSize() {
  // 获取视窗尺寸
  const bodyW = document.documentElement.clientWidth;
  const bodyH = document.documentElement.clientHeight;
  // 计算比例,用视窗尺寸与内容的实际尺寸相除
  const wScale = bodyW / 720;
  const hScale = bodyH / 720;
  const scale = Math.min(wScale, hScale);
  const $main = document.querySelector(".main");
  $main.style.transform = `translateX(-50%) translateY(-50%) scale(${scale})`;
}
```

[点击这里看 demo,修改浏览器视窗大小看效果](https://zhangxuekang.github.io/src/blog/mobile-size-set/hedgehog.html)
