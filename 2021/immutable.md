# 不可变数据结构

> Immutable data cannot be changed once created, leading to much simpler application development, no defensive copying, and enabling advanced memoization and change detection techniques with simple logic. Persistent data presents a mutative API which does not update the data in-place, but instead always yields new updated data.    --- immutable.js 官网

Immutable Data 就是一旦创建，就不能再被更改的数据。如果尝试调用方法去修改，就会返回一个新的数据，原来的数据不会改变。想达到的效果基本和 deepCopy 一样，但是没有 deepCopy 将所有节点进行复制一遍带来的性能损耗。

immutable.js 和 immer.js 使用了一样的“深复制”策略，即如果对象树中一个节点发生变化，只修改这个节点和受它影响的父节点，其它节点则进行共享。

![clone](../assets/immutable)

### 使用场景

### 弊端

### 官方使用实践