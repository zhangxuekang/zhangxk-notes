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
