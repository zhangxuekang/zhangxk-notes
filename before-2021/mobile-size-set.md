# 移动端页面元素尺寸解决方案之一

如果html5要适应各种分辨率的移动设备,应该使用rem这样的尺寸单位.主流做法基本也都是这样做的.但是,如果html5页面是在webview中打开的,并且webview不是通常的手机视窗尺寸,而是占了部分页面,使用rem单位的转化标准就没有了通用性.面对这种情况,可以尝试以下的解决方案.
<img alt="非全屏的webview" src="https://zhangxuekang.com/src/blog/mobile-size-set/mobile-size.png" width="60%">
## 使用transform的scale来适配所有尺寸的view
设计稿的尺寸一般是px,那么写页面的时候,就使用px单位,大小和设计稿保持一致就好.内容区域的最外层使用scale缩放,缩放的比例根据内容区原始的尺寸与渲染区域(如果是webview中就是webview的大小,如果是浏览器中就是浏览器视窗的大小)的比例来决定的.

举个例子,写个demo:
```html
<body>
  <div class="main">
  </div>
</body>
```
class为main的dev是内容区域,内部可以随意添加布置元素.想达到的效果是main元素随着窗口等比例放大缩小,宽最大不超过视窗的宽,高最大不超过视窗的高.
main元素关键样式:
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
页面加载好后,监听视窗尺寸的变化,修改main元素的transform属性:
```js
window.addEventListener('resize', updateSize)
window.addEventListener('load', updateSize)
function updateSize() {
  // 获取视窗尺寸
  const bodyW = document.documentElement.clientWidth;
  const bodyH = document.documentElement.clientHeight;
  // 计算比例,用视窗尺寸与内容的实际尺寸相除
  const wScale = bodyW / 720;
  const hScale = bodyH / 720;
  const scale = Math.min(wScale, hScale);
  const $main = document.querySelector('.main');
  $main.style.transform = `translateX(-50%) translateY(-50%) scale(${scale})`;
}
```
[点击这里看demo,修改浏览器视窗大小看效果](https://zhangxuekang.com/src/blog/mobile-size-set/hedgehog.html)


