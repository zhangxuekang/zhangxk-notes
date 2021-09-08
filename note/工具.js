// 尝试获取数据,失败后重试
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
