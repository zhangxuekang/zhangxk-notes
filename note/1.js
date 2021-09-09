// 简单版本的实现promise
{
  // 三个常量用于表示状态
  const PENDING = "pending";
  const RESOLVED = "resolved";
  const REJECTED = "rejected";

  function MyPromise(fn) {
    const that = this;
    this.state = PENDING;

    // value 变量用于保存 resolve 或者 reject 中传入的值
    this.value = null;

    // 用于保存 then 中的回调，因为当执行完 Promise 时状态可能还是等待中，这时候应该把 then 中的回调保存起来用于状态改变时使用
    that.resolvedCallbacks = [];
    that.rejectedCallbacks = [];

    function resolve(value) {
      // 首先两个函数都得判断当前状态是否为等待中
      if (that.state === PENDING) {
        that.state = RESOLVED;
        that.value = value;

        // 遍历回调数组并执行
        that.resolvedCallbacks.map((cb) => cb(that.value));
      }
    }
    function reject(value) {
      if (that.state === PENDING) {
        that.state = REJECTED;
        that.value = value;
        that.rejectedCallbacks.map((cb) => cb(that.value));
      }
    }

    // 完成以上两个函数以后，我们就该实现如何执行 Promise 中传入的函数了
    try {
      fn(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }

  // 最后我们来实现较为复杂的 then 函数
  MyPromise.prototype.then = function (onFulfilled, onRejected) {
    const that = this;

    // 判断两个参数是否为函数类型，因为这两个参数是可选参数
    onFulfilled = typeof onFulfilled === "function" ? onFulfilled : (v) => v;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (e) => {
            throw e;
          };

    // 当状态不是等待态时，就去执行相对应的函数。如果状态是等待态的话，就往回调函数中 push 函数
    if (this.state === PENDING) {
      this.resolvedCallbacks.push(onFulfilled);
      this.rejectedCallbacks.push(onRejected);
    }
    if (this.state === RESOLVED) {
      onFulfilled(that.value);
    }
    if (this.state === REJECTED) {
      onRejected(that.value);
    }
  };
}
// 自己实现bind
{
  Function.prototype.myBind = function (context) {
    if (typeof this !== "function") {
      throw new TypeError("Error");
    }
    const _this = this;
    const args = [...arguments].slice(1);
    // 返回一个函数
    return function F() {
      // 因为返回了一个函数，我们可以 new F()，所以需要判断
      if (this instanceof F) {
        return new _this(...args, ...arguments);
      }
      return _this.apply(context, args.concat(...arguments));
    };
  };
}
// 精度小数计算
{
  function add(num1, num2) {
    const len1 = getLen(num1);
    const len2 = getLen(num2);
    const max = Math.max(len1, len2);
    const num = Math.pow(10, max);
    return (num1 * num + num2 * num) / num;
  }

  function getLen(num) {
    const str = num.toString();
    if (str.indexOf(".") > -1) {
      return str.split(".")[1].length;
    } else {
      return 0;
    }
  }
}
// 字符串全排列
{
  function fullPermutation(str) {
    let result = [];
    if (str.length === 0) {
      return [];
    } else if (str.length === 1) {
      return [str];
    } else {
      for (let i = 0; i < str.length; i++) {
        let target = str[i]; // 循环字符串,取出每一个值
        let rest = str.slice(0, i) + str.slice(i + 1, str.length); // 剩下的字符串
        const full = fullPermutation(rest); // 将剩下的字符串进行全排列
        full.forEach((v) => {
          result.push(target + v); // 将本次取出的字符与剩下的字符串全排列的结果进行拼接
        });
      }
    }
    return result;
  }
}
// 数字变化函数
{
  function countUp(options, spitOut) {
    const { duration, startNumber, n } = {
      duration: 1000,
      startNumber: 0,
      ...options,
    };
    if (startNumber >= n) {
      spitOut(n);
      return;
    }
    let N = startNumber;
    const startTime = +new Date();
    requestAnimationFrame(count);

    function count() {
      const now = +new Date();
      if (now - startTime >= duration) {
        spitOut(n);
      } else {
        const progress = (now - startTime) / duration; // 可加缓动效果
        const next = startNumber + Math.floor((n - startNumber) * progress);
        if (next !== N) {
          N = next;
          spitOut(N);
        }
        requestAnimationFrame(count);
      }
    }
  }
}

{
  // 模板渲染函数
  var str = `<div>
               {data.a}
               <span>{data.a}</span>
               <span>{data.b.c}</span>
               <span>{data.b.c}</span>
             </div>`;

  function render(tpl, data) {
    // 补充函数体
    const htmlStr = tpl.replace(/\{.*?\}/g, (a) => {
      a = a.replace(/(\{|\})/g, "");
      a = a.split(".").map((v) => v.trim());
      let value = data;
      a.forEach((v, i) => {
        if (i > 0) {
          value = value[v];
        }
      });
      return value;
    });
  }
}
