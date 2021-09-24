外边距重叠：块的上外边距(margin-top)和下外边距(margin-bottom)有时合并(折叠)为单个边距

1. 同一层相邻元素之间
2. 没有内容将父元素和后代元素分开，父元素没有行内内容，没有 padding 和 border，没有 bfc(块级格式化上下文)
3. 空的块级元素，含有 margin-top 和 margin-bottom

---

刘海屏幕：

```html
<meta name="viewport" content="width=device-width, viewport-fit=cover" />
```

```css
padding: constant(safe-area-inset-top) constant(safe-area-inset-right) constant(
    safe-area-inset-bottom
  ) constant(safe-area-inset-left);
padding: env(safe-area-inset-top) env(safe-area-inset-right) env(
    safe-area-inset-bottom
  ) env(safe-area-inset-left);
```

---

动画：
@keyframes
animation 属性是 name 名称，duration 时长, timing-function 时间模式，delay 延迟，iteration-count 次数，direction 方向，fill-mode 结束状态

---

1 像素：

scale，linear-gradient，box-shadow（0 0.5px 0 0 #000）（支持小数），svg，viewport：
const dpr = window.devicePixelRatio
const meta = document.createElement('meta') // 创建 meta 视口标签
meta.setAttribute('name', 'viewport') // 设置 name 为 viewport
meta.setAttribute('content', `width=device-width, user-scalable=no, initial-scale=${1/dpr}, maximum-scale=${1/dpr}, minimum-scale=${1/dpr}`)
动态初始缩放、最大缩放、最小缩放比例

---

## 如何实现 css 高度根据宽度变化

如果 padding 属性的值是百分比值，这个值是根据父元素的宽度(X 轴属性)计算的，即使是 Y 轴上的 padding(padding-top,padding-bottom)也是如此。根据这个特性，可以实现 Y 轴尺寸和 X 轴尺寸相关联的效果。

```css
.el {
  width: 50%;
  height: 0;
  padding-bottom: 50%;
  background-color: black;
}
```
