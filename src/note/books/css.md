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

keyframes 的写法

```css
@keyframes rainbow {
  0% {
    background: #c00;
  }
  50% {
    background: orange;
  }
  100% {
    background: yellowgreen;
  }
}

@keyframes rainbow {
  from {
    background: #c00;
  }
  50% {
    background: orange;
  }
  to {
    background: yellowgreen;
  }
}
```

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

## flex

### 容器属性：

- flex-direction
  - 轴线方向
  - **row** | row-reverse | column | column-reverse;
- flex-wrap
  - 要不要换行
  - **nowrap** | wrap | wrap-reverse;
- flex-flow
  - flex-direction 和 flex-wrap 的简写
- justify-content
  - 主轴上的对齐方式
  - **flex-start** | flex-end | center | space-between | space-around;
- align-items
  - 交叉轴上如何对齐
  - **flex-start** | flex-end | center | baseline | stretch;
- align-content
  - 多根轴线的对齐方式，如果只有一根轴线，不起作用
  - flex-start | flex-end | center | space-between | space-around | **stretch**;

### 项目属性

- order
  - 排列顺序。数值越小，排列越靠前，**默认为 0**。
- flex-grow
  - 定义项目的放大比例，**默认为 0**，即如果存在剩余空间，也不放大。
  - 某个项目的放大空间为：剩余空间 \* 该项目的 flex-grow 值 / 所有项目的 flex-grow 值和
- flex-shrink
  - 项目的缩小比例，**默认为 1**，即如果空间不足，该项目将缩小。
  - 某个项目的缩小空间为：需要缩小的总空间 \* 该项目的 flex-shrink 值 / 所有项目的 flex-shrink 值和
- flex-basis
  - 在分配多余空间之前，项目占据的主轴空间，浏览器根据这个属性，计算主轴是否有多余空间。它的**默认值为 auto**，即项目的本来大小。
- flex
  - flex-grow, flex-shrink 和 flex-basis 的简写，后两个值可选，**默认 0 1 auto**
  - 快捷值：**auto (1 1 auto)** 和 **none (0 0 auto)**。
- align-self
  - 单个项目有与其他项目不一样的对齐方式，可覆盖 **align-items** 属性

### flex 中的 width 属性

在 Flex 布局中，子项设置 width 是没有直接效果的。flex-basis 优先级是比 width 高的。如果 flex-basis 设置为 auto，那么 width 就会生效（可以理解为 flex-basis 放弃了自己的权利）。

- width 只是 flex-basis 为 auto 时候间接生效，其余时候使用优先级更高的 flex-basis 属性值；
- flex 子项元素尺寸还与元素内容自身尺寸有关，即使设置了 flex-basis 属性值；元素实际尺寸大于 flex-basis，会显示实际尺寸
