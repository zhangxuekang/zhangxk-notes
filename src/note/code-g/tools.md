## 尝试获取数据,失败后重试

```ts
function tryPromise(getData, time, delay) {
  return new Promise((resolve, reject) => {
    function fn() {
      getData()
        .then(resolve)
        .catch((e) => {
          if (time > 0) {
            time--;
            setTimeout(() => {
              fn();
            }, delay);
          } else {
            reject(e);
          }
        });
    }
    fn();
  });
}

```
## 节流

```ts
function throttle(fn, wait) {
  let lastTime = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastTime > wait) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
}

```
## 防抖

```ts
function debounce(fn, wait) {
  let timer = null;
  return function (...args) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, wait);
  };
}

```
## 模板渲染函数

```ts
const tpl = `
<div>
  {data.a}
  <span>{data.a}</span>
  <span>{data.b.c}</span>
  <span>{data.b.d}</span>
</div>`;
const data: any = {
  a: "aaa",
  b: { c: "ccc", d: "ddd" },
};

function render(tpl: string, data: any) {
  return tpl.replace(/\{.*?\}/g, (substr) => {
    substr = substr.replace(/\{|\}/g, "");
    const list = substr.split(".").map((v) => v.trim());
    let v = data;
    list.forEach((p, i) => {
      if (i > 0) {
        v = v[p];
      }
    });
    return v;
  });
}

```
## 发布订阅

```ts
class myEvent {
  _cache: any;

  constructor() {
    this._cache = {};
  }

  on(type, callback) {
    this._cache[type] = this._cache[type] || [];
    if (this._cache[type].indexOf(callback) === -1) {
      this._cache[type].push(callback);
    }
    return this;
  }

  off(type, callback) {
    const fns = this._cache[type];
    if (Array.isArray(fns)) {
      if (callback) {
        const index = fns.indexOf(callback);
        if (index !== -1) {
          fns.splice(index, 1);
        }
      } else {
        // 全部清空
        fns.length = 0;
      }
    }
    return this;
  }

  emit(type, data) {
    const fns = this._cache[type];
    if (Array.isArray(fns)) {
      fns.forEach((fn) => {
        fn(data);
      });
    }
    return this;
  }
}

```
## 接口并发控制函数

```ts

function createNewFetch(getData, n) {
  const cacheList = []; // 保存操作函数列表
  let count = 0; // 记录当前的并发数

  // 加入新函数，或者完成一个请求后运行
  function next() {
    if (count < n && cacheList.length) {
      count++;
      const fn = cacheList.shift();
      if (fn) {
        fn();
      }
    }
  }

  return function (url) {
    return new Promise((resolve, reject) => {
      cacheList.push(() => {
        getData(url)
          .then(resolve)
          .catch(reject)
          .finally(() => {
            count--;
            next();
          });
      });
      next();
    });
  };
}

```
## promiseAll 添加并发控制

```ts
function controlledPromiseAll(urls, n) {
  return new Promise((resolve, reject) => {
    const len = urls.length;
    const result = new Array(len);
    let count = 0; // 当前完成的数量
    let m = 0; // 并发数
    const fnList = []; // promise 函数列表

    urls.forEach((url, i) => {
      fnList.push(function () {
        fetch(url)
          .then((data) => {
            count++;
            m--;
            result[i] = data;
            if (count === len) {
              resolve(result);
            } else {
              next();
            }
          })
          .catch(reject);
      });
      next();
    });

    function next() {
      if (m < n && fnList.length) {
        m++;
        const fn = fnList.shift();
        fn();
      }
    }
  });
}
```
