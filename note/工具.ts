/* 尝试获取数据,失败后重试 */
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
