/** 尝试获取数据,失败后重试 **/
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

/** 节流 **/
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

/** 防抖 **/
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

/** 模板渲染函数 **/
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

/** 发布订阅 **/
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
