/* 尝试获取数据,失败后重试 */
function myPromise(getData, time, delay) {
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

/* 节流 */
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

/* 防抖 */
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

/* call */
(Function.prototype as any).myCall = function (context, ...args) {
  if (typeof this !== "function") {
    throw new TypeError("Error");
  }
  context = context || window;
  context._fn_ = this;
  const result = context._fn_(...args);
  delete context._fn_;
  return result;
};

/* apply */
(Function.prototype as any).myApply = function (context, args) {
  if (typeof this !== "function") {
    throw new TypeError("Error");
  }
  context = context || window;
  context._fn_ = this;
  const result = context._fn_(...args);
  delete context._fn_;
  return result;
};
