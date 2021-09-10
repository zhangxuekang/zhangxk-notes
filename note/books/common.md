移动端 click 事件 300ms 的延迟响应

1. 禁用缩放

```html
<meta name="viewport" content="user-scalable=no" />
<meta name="viewport" content="initial-scale=1,maximum-scale=1" />
```

2. touchstart 代替

---

性能优化：
1、减少请求
2、使用服务端渲染
3、使用 cdn
4、css 头部，js 底部
5、压缩文件
6、图片优化（不用图片，延迟加载）
7、减少重绘、回流
8、使用事件委托

---

- GET 在浏览器回退时是无害的，而 POST 会再次提交请求。
- GET 产生的 URL 地址可以被 Bookmark，而 POST 不可以。
- GET 请求会被浏览器主动 cache，而 POST 不会，除非手动设置。
- GET 请求只能进行 url 编码，而 POST 支持多种编码方式。
- GET 请求参数会被完整保留在浏览器历史记录里，而 POST 中的参数不会被保留。
- GET 请求在 URL 中传送的参数是有长度限制的，而 POST 么有。
- 对参数的数据类型，GET 只接受 ASCII 字符，而 POST 没有限制。
- GET 比 POST 更不安全，因为参数直接暴露在 URL 上，所以不能用来传递敏感信息。
- GET 参数通过 URL 传递，POST 放在 Request body 中。

---

CSRF / XSRF（跨站请求伪造）盗用了身份，浏览危险网站
token，添加验证码、密码等，涉及到数据修改操作严格使用 post 请求而不是 get 请求

XSS/CSS（跨站脚本攻击）植入恶意脚本
对用户输入内容和服务端返回内容进行过滤和转译

ClickJacking（点击劫持）利用透明 iframe 覆盖原网页诱导用户进行某些操作达成目的。

---

强制缓存优先于协商缓存进行，若强制缓存(Expires 和 Cache-Control)生效则直接使用缓存，若不生效则进行协商缓存

(Last-Modified / If-Modified-Since 和 Etag / If-None-Match)，协商缓存由服务器决定是否使用缓存，若协商缓存效，那么代表该请求的缓存失效，重新获取请求结果，再存入浏览器缓存中；生效则返回 304，继续使用缓存

---

浏览器的渲染过程主要包括以下几步：

1. 解析 HTML 生成 DOM 树。
2. 解析 CSS 生成 CSSOM 规则树。
3. 将 DOM 树与 CSSOM 规则树合并在一起生成渲染树。
4. 遍历渲染树开始布局，计算每个节点的位置大小信息。
5. 将渲染树每个节点绘制到屏幕。

---

进程线程

<https://segmentfault.com/a/1190000017048240>

---
