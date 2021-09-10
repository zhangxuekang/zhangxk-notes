- [web 录制解决方案](#web-录制解决方案)
  - [视频流](#视频流)
  - [事件流](#事件流)
- [rrweb 原理](#rrweb-原理)
  - [记录](#记录)
  - [回放](#回放)

## web 录制解决方案

### 视频流

- MediaRecorder Api 浏览器录屏 api,媒体流数据
- HTML to Canvas 固定频率截图,模拟录制

优点:

支持复杂元素,canvas,video
支持多标签

缺点:

消耗高
只能录制屏幕显示数据
用户操作成本高(授权等)
兼容性差(ie,安卓)

### 事件流

- user event record 录制用户操作事件,沙箱模拟回放
- UI event record 录制浏览器信息变更(dom css),沙箱模拟回放

优点:

产物体积小
性能消耗小,用户无感知
支持窗口最大化,最小化,全屏等

缺点:

复杂元素差
tab 页面刷新后录制中断

## rrweb 原理

### 记录

- 将 dom 及其状态转化为可序列化的数据结构 snapshot dom-vdom
  - html-json
  - 表单值写成 html 属性
  - script 标签改成 noscript,避免意外执行 js
  - 样式内联
  - ...
- 监听增量更新
  - 类型
    - dom mutation
    - input event
      - 不记录 password
    - mouse event
    - window event
    - ...
- 数据存储

### 回放

- 实例化
  - div 模拟鼠标
  - canvas 模拟鼠标轨迹
- rebuild dom
- 应用增量更新
