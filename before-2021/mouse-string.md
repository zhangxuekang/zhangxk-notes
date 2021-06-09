# js 简单实现的鼠标跟随效果

&emsp;&emsp;记得早年风靡装饰非主流 QQ 空间, 各种克隆空间的网站大行其道. 如果复制了某个狂拽酷炫的空间(必须有 DJ 背景音乐, 必须有轮播的视频图片, 配色必须黑底花字, 最好有鼠标跟随特效...)那么感觉自己就像是这条街最帅的仔了. 现在回忆起往事, 感慨万千, 时光一去不复返, 如果能穿越回去, 我一定扇死自己:)

&emsp;&emsp;虽然回忆起来就辣眼睛, 但是鼠标跟随特效还是很有应用前途的(强迫让自己相信). 曾经见过一个我认为最牛逼的纯 css 实现方案, 将页面铺满小 div 元素, 根据窗口绝对定位, 每个 div 都有:hover 反应, 只要你的 div 足够小足够多, 看起来就像是鼠标跟随特效的, 如果再加上点延迟效果, 前途不可限量.

&emsp;&emsp;既然 css 方案这么牛逼, 所以我选择用 js 实现(逃). 思路就是给 window 加鼠标移动监听事件, 获取鼠标的位置信息, 将位置信息赋给一个绝对定位的元素.

&emsp;&emsp;来看下代码, 先 creat 个相对于 body 绝对定位的元素:

```js
const $follow = document.createElement('div');
$follow.setAttribute('class', 'follow');
$body.appendChild($follow);
```

```css
.follow {
  position: absolute;
  width: 100px;
  height: 100px;
  background-color: red;
}
```

&emsp;&emsp;元素已经有了, 现在添加事件:

```js
window.addEventListener('mousemove', (e) => {
  const x = parseFloat(e.clientX);
  const y = parseFloat(e.clientY);
  $follow.style.left = x + 'px';
  $follow.style.top = y + 'px';
});
```

&emsp;&emsp;移动跟随效果有了, 但是要多丑有多丑. 还有个小问题, 刚进入页面鼠标还没有移动的时候, 方块显示在左上角位置. 在 css 中加条规则:

```css
.follow {
  // ...
  display: none;
}
```

&emsp;&emsp;然后在事件中设置显示. 为了看起来更和谐, 将元素定位在鼠标的右边 20px 和下边 20px 处.

```js
window.addEventListener('mousemove', (e) => {
  // ...
  $follow.style.display = 'block';
  $follow.style.left = x + 20 + 'px';
  $follow.style.top = y + 20 + 'px';
});
```

&emsp;&emsp;可以将丑爆的背景颜色替换成背景图片, 最好还是动态的 gif 图, 看起来更有逼格.

&emsp;&emsp;原理很简单, 也就是入门一周的水平, 但是设计好了会产生比较炫酷的效果.

&emsp;&emsp;28 行 js 代码实现的一个小[demo](https://zhangxuekang.com/mouse-show/index.html).

&emsp;&emsp;[github 地址](https://github.com/zhangxuekang/mouse-show).
